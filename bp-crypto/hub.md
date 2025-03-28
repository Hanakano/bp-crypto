# Crypto Integration

*Note: This is an "encryption" crypto integration, NOT a cryptocurrency integration!*

## ⚠️ Important Security Disclaimer ⚠️
**If you have any doubts about handling secure data, you should consult with a cybersecurity professional.**

## Overview
This Botpress integration exposes selected functions from Node.js's standard `crypto` library, providing secure cryptographic operations directly within your Botpress workflow.

## Supported Actions

### Encrypt
- **Description**: Encrypts stringified data using AES encryption
- **Parameters**:
  - `data` (string, required): Data to be encrypted
  - `algorithm` (string, optional): Encryption algorithm (default: `aes-256-cbc`)
    - **Assumption**: Only `aes-256-cbc` and `aes-256-ecb` are supported. Want more algorithms supported? [Open a PR](https://www.github.com/hanakano/bp-crypto)
  - `key` (string, required): Base64 encoded encryption key
- **Assumptions**:
  - Input data will be base64 encoded
  - A random 16-byte initialization vector (IV) will be generated
  - Returns base64 encoded output with IV prefix
- **Output**:
  - `output` (string): Base64 encoded encrypted data with IV prefix

### Decrypt
- **Description**: Decrypts previously encrypted data
- **Parameters**:
  - `data` (string, required): Base64 encoded encrypted data
  - `algorithm` (string, optional): Decryption algorithm (default: `aes-256-cbc`)
    - **Assumption**: Only `aes-256-cbc` and `aes-256-ecb` are supported
  - `key` (string, required): Base64 encoded decryption key
  - `ivLength` (number, optional): Length of IV prefix (default: 16)
- **Assumptions**:
  - Input data is base64 encoded
  - IV is the first 16 bytes (or specified length) of the encrypted data
- **Output**:
  - `output` (string): Decrypted data as a UTF-8 string

### Hash Data
- **Description**: Generates a cryptographic hash of input data
- **Parameters**:
  - `data` (object, required): Data to be hashed
  - `algorithm` (string, optional): Hash algorithm (default: `sha256`)
- **Assumptions**:
  - Input data will be converted to a JSON string before hashing
  - Supports any algorithm supported by Node.js crypto
- **Output**:
  - `data` (string): Hex-encoded hash of the input data

### HMAC
- **Description**: Creates a Hash-based Message Authentication Code
- **Parameters**:
  - `data` (object, required): Data to be processed
  - `algorithm` (string, optional): HMAC algorithm (default: `sha256`)
  - `key` (string, required): Secret key for HMAC generation
- **Assumptions**:
  - Input data will be converted to a JSON string
  - Supports any algorithm supported by Node.js crypto
- **Output**:
  - `data` (string): Hex-encoded HMAC of the input data

### Verify HMAC
- **Description**: Verifies the integrity of HMAC-protected data
- **Parameters**:
  - `algorithm` (string, required): Hash algorithm (e.g., `sha256`)
  - `key` (string, required): Secret key used to generate the original HMAC
  - `data` (string, required): Original data
  - `expectedHmac` (string, required): Expected HMAC value to compare against
- **Assumptions**:
  - Exact match required between computed and expected HMAC
- **Output**:
  - `valid` (boolean): `true` if HMAC matches, `false` otherwise

### Random UUID
- **Description**: Generates a cryptographically secure random UUID
- **Parameters**:
  - `options` (object, optional):
    - `disableEntropyCache` (boolean): Option to disable entropy cache
- **Assumptions**:
  - Uses Node.js's cryptographically secure UUID generation
- **Output**:
  - `uuid` (string): Randomly generated UUID

## Security Considerations
- 🚨 **CRITICAL**: Do not use this integration for storing or transmitting extremely sensitive information without additional security measures.
- Always use strong, unique keys
- Rotate encryption keys regularly
- Implement additional security layers as needed

## Usage Recommendations
1. Use `aes-256-cbc` over `aes-256-ecb` when possible
2. Protect your encryption keys
3. Never hardcode sensitive information
4. Consider additional encryption for highly sensitive data

## Limitations
- Only specific crypto algorithms are supported
- No advanced key management
- Minimal error handling

## About the Author
This integration is built and maintained by Hanakano, a premier Botpress Partner! Learn more about us at https://www.hanakano.com

## Contributing
This integration is open-source and contributions are welcome! Get started at https://www.github.com/hanakano/bp-crypto
