const keccak256 = require("keccak256");
const { default: MerkleTree } = require("merkletreejs");

const address = [
  "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
  "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
];

//  Hashing All Leaf Individual
const leaves = address.map((leaf) => keccak256(leaf));

// Constructing Merkle Tree
const tree = new MerkleTree(leaves, keccak256, {
  sortPairs: true,
});

//  Utility Function to Convert From Buffer to Hex
const buf2Hex = (x) => "0x" + x.toString("hex");

// Get Root of Merkle Tree
console.log(`Here is Root Hash: ${buf2Hex(tree.getRoot())}`);
