
// Type Imports:
import type { ABI } from 'weaverfi/dist/types';

/* ========================================================================================================================================================================= */

// sAXIAL ABI:
export const sAXIALABI: ABI[] = [
  { constant: true, inputs: [], name: "getAllUsers", outputs: [{ name: "", type: "address[]" }], type: "function" },
  { constant: true, inputs: [{ name: "_userAddr", type: "address" }], name: "getBalance", outputs: [{ name: "", type: "uint256" }], type: "function" }
];

// veAXIAL ABI:
export const veAXIALABI: ABI[] = [
  { constant: true, inputs: [], name: "getAllUsers", outputs: [{ name: "", type: "address[]" }], type: "function" },
  { constant: true, inputs: [{ name: "_userAddr", type: "address" }], name: "getAccrued", outputs: [{ name: "", type: "uint256" }], type: "function" },
  { constant: true, inputs: [{ name: "_userAddr", type: "address" }], name: "getStaked", outputs: [{ name: "", type: "uint256" }], type: "function" }
];