const config = require('../config');

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployments, getNamedAccounts } = require("hardhat");

function setNextBlockTimestamp(ts) {
    return ethers.provider.send('evm_setNextBlockTimestamp', [ts]);
}

function increaseTime(secs) {
    return ethers.provider.send('evm_increaseTime', [secs]);
}

describe("OSKY token", () => {
    let token;
    let deployer;
    let snapshot;

    before(async () => {
        ({deployer} = await getNamedAccounts());
        const signers = await ethers.getSigners();
        await deployments.fixture(['OSKYToken']);

        token = await ethers.getContract("OSKYToken");
    });

    beforeEach(async () => {
        snapshot = await ethers.provider.send('evm_snapshot', []);
    })

    afterEach(async () => {
        await ethers.provider.send('evm_revert', [snapshot]);
    });

    describe("minting", () => {
        it("should not allow minting until the first mint window", async () => {
            await expect(token.mint(deployer, 1)).to.be.revertedWith("Cannot mint yet");
        });

        it("should allow the owner of the contract to mint new tokens", async () => {
            await increaseTime(365 * 24 * 60 * 60);
            const balanceBefore = await token.balanceOf(deployer);
            const mintAmount = (await token.totalSupply()).div(50);
            await token.mint(deployer, mintAmount);
            expect(await token.balanceOf(deployer)).to.equal(balanceBefore.add(mintAmount));
        });

        it("should not allow non-owners to mint new tokens", async () => {
            await increaseTime(365 * 24 * 60 * 60);
            await expect(token
                .connect((await ethers.getSigners())[1])
                .mint(deployer, 1)
            ).to.be.revertedWith("caller is not the owner");
        });

        it("should not allow minting before the next mint window", async () => {
            await increaseTime(365 * 24 * 60 * 60);
            await token.mint(deployer, 1);
            await expect(token.mint(deployer, 1)).to.be.revertedWith("Cannot mint yet");
        });

        it("should not allow minting more than the prescribed amount", async () => {
            await increaseTime(365 * 24 * 60 * 60);
            await expect(
                token.mint(deployer, (await token.totalSupply()).div(50).add(1))
            ).to.be.revertedWith("Mint exceeds maximum amount");
        });
    });
});
