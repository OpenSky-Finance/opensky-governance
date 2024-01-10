// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @dev OpenSky Token.
 *       - Support voting.
 *       - Support for the owner (the DAO) to mint new tokens, at up to 2% PA.
 */
contract OSKYToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    uint256 public constant minimumMintInterval = 365 days;
    uint256 public constant mintCap = 200; // 2%

    uint256 public nextMint; // Timestamp

    /**
     * @dev Constructor.
     * @param supply The number of tokens to issue to the contract deployer.
     */
    constructor(
        uint256 supply,
        address initialOwner)
        ERC20("OpenSky Token", "OSKY")
        ERC20Permit("OpenSky Token")
    {
        _mint(initialOwner, supply);
        nextMint = block.timestamp + minimumMintInterval;
    }

    /**
     * @dev Mints new tokens. Can only be executed every `minimumMintInterval`, by the owner, and cannot
     *      exceed `mintCap / 10000` fraction of the current total supply.
     * @param dest The address to mint the new tokens to.
     * @param amount The quantity of tokens to mint.
     */
    function mint(address dest, uint256 amount) external onlyOwner {
        require(amount <= (totalSupply() * mintCap) / 10000, "OSKY: Mint exceeds maximum amount");
        require(block.timestamp >= nextMint, "OSKY: Cannot mint yet");

        nextMint = block.timestamp + minimumMintInterval;
        _mint(dest, amount);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
