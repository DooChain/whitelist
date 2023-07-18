import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import fs from "fs";

const data = fs.readFileSync("../data.json", "utf8");
// Parse the JSON data
const jsonData = await JSON.parse(data);

//  Hashing All Leaf Individual
const leaves = await jsonData.contacts.map((leaf) => keccak256(leaf));

// Constructing Merkle Tree
export const tree = new MerkleTree(leaves, keccak256, {
  sortPairs: true,
});
