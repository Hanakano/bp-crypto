# Crypto Integration for Botpress

*Note: This is an "encryption" crypto integration for securing data, NOT a cryptocurrency integration!*

## ⚠️ Important Security Disclaimer ⚠️
**Cryptographic operations are sensitive. Incorrect implementation or key management can lead to security vulnerabilities. If you have any doubts about handling secure data or configuring this integration, consult with a cybersecurity professional. Use this integration at your own risk. The authors and maintainers are not liable for any security breaches.**

## Overview
This Botpress integration exposes selected functions based on Node.js's standard `crypto` library, the popular [`uuid`](https://github.com/uuidjs/uuid) library, and the [`fernet`](https://github.com/fernet/spec/blob/master/Spec.md) specification (via the `fernet` npm package). It provides essential cryptographic operations like encryption, decryption, hashing, HMAC generation/verification, Base64 encoding/decoding, and UUID generation directly within your Botpress workflows.

## Supported Actions

*(Parameters marked with `*` are required)*

### Encrypt
- **Description**: Encrypts a string using a specified AES algorithm (defaults to AES-256-CBC). Useful for securing data before storing or transmitting it.
- **Parameters**:
  - `data` (string\*): The string data to encrypt (often stringified JSON).
  - `key` (string\*): The secret encryption key, **encoded in Base64**. Must be the correct length for the chosen algorithm (e.g., 32 bytes for AES-256).
  - `algorithm` (string, default: `aes-256-cbc`): The AES encryption algorithm to use. Currently supports `aes-256-cbc` and `aes-256-ecb`.
- **Process**:
  - A random 16-byte Initialization Vector (IV) is generated.
  - The data is encrypted using the provided algorithm, Base64-decoded key, and the generated IV.
- **Output**:
  - `output` (string): The encrypted data, **encoded in Base64**. This string contains the 16-byte IV prepended to the actual encrypted ciphertext.

### Decrypt
- **Description**: Decrypts a string previously encrypted by the `Encrypt` action or compatible AES encryption.
- **Parameters**:
  - `data` (string\*): The **Base64 encoded** encrypted data, which *must* include the Initialization Vector (IV) as a prefix.
  - `key` (string\*): The secret decryption key, **encoded in Base64**. Must match the key used for encryption.
  - `algorithm` (string, default: `aes-256-cbc`): The AES decryption algorithm. Must match the algorithm used for encryption.
  - `ivLength` (number, default: 16): The length (in bytes) of the IV prefix included at the start of the input `data`.
- **Process**:
  - The Base64 input `data` is decoded.
  - The IV is extracted from the beginning of the decoded data based on `ivLength`.
  - The remaining data is decrypted using the provided algorithm, Base64-decoded key, and the extracted IV.
- **Output**:
  - `output` (string): The original decrypted data as a UTF-8 string.

### Decrypt Fernet
- **Description**: Decrypts a token generated according to the [Fernet specification](https://github.com/fernet/spec/blob/master/Spec.md). Fernet tokens provide symmetric-key authenticated encryption.
- **Parameters**:
  - `data` (string\*): The Fernet token string (URL-safe Base64 encoded).
  - `key` (string\*): The secret Fernet key (must be 32 bytes, URL-safe Base64 encoded).
- **Process**:
  - Uses the `fernet` library to parse and validate the token.
  - Verifies the token's signature using the provided key.
  - Decrypts the message payload using AES-128-CBC.
  - TTL (Time-To-Live) checks are explicitly disabled (`ttl: 0`).
- **Output**:
  - `output` (string): The original decrypted data as a UTF-8 string.

### Hash Data
- **Description**: Generates a cryptographic hash (digest) of the input data using a specified algorithm. Useful for data integrity checks or generating fixed-size representations.
- **Parameters**:
  - `data` (any\*): The data to be hashed. This data will be converted to a JSON string using `JSON.stringify()` before hashing.
  - `algorithm` (string, default: `sha256`): The hashing algorithm to use (e.g., `sha256`, `sha512`, `md5`). Must be supported by Node.js `crypto.createHash`.
- **Process**:
  - The input `data` is serialized to a JSON string.
  - A hash is computed on the resulting string using the specified algorithm.
- **Output**:
  - `output` (string): The computed hash, encoded as a hexadecimal string.

### HMAC
- **Description**: Creates a Hash-based Message Authentication Code (HMAC). HMACs are used to verify both the integrity and authenticity of a message using a secret key.
- **Parameters**:
  - `data` (any\*): The data for which to generate the HMAC. This data will be converted to a JSON string using `JSON.stringify()` before processing.
  - `key` (string\*): The secret key shared between the sender and receiver.
  - `algorithm` (string, default: `sha256`): The hashing algorithm to use for the HMAC (e.g., `sha256`, `sha512`). Must be supported by Node.js `crypto.createHmac`.
- **Process**:
  - The input `data` is serialized to a JSON string.
  - An HMAC is computed on the resulting string using the specified algorithm and secret key.
- **Output**:
  - `output` (string): The computed HMAC, encoded as a hexadecimal string.

### Verify HMAC
- **Description**: Verifies an HMAC signature by recomputing it on the original data with the secret key and comparing it to the provided expected HMAC.
- **Parameters**:
  - `data` (string\*): The original data (as a string) that was used to generate the HMAC.
  - `key` (string\*): The secret key used for the HMAC computation.
  - `algorithm` (string\*): The hashing algorithm used (e.g., `sha256`). Must match the algorithm used for generation.
  - `expectedHmac` (string\*): The received or expected HMAC value (hex-encoded string) to compare against.
- **Process**:
  - An HMAC is computed on the input `data` using the provided `key` and `algorithm`.
  - The computed HMAC is compared (in a timing-safe manner implicitly by Node.js crypto) to the `expectedHmac`.
- **Output**:
  - `valid` (boolean): `true` if the computed HMAC exactly matches the `expectedHmac`, `false` otherwise.

### Random UUID
- **Description**: Generates a random Version 4 UUID.
- **Parameters**:
  - *(No input parameters currently defined in schema)*
- **Process**:
  - Uses the `v4` function from the [`uuid`](https://github.com/uuidjs/uuid) npm package, which relies on cryptographically strong random number generation.
- **Output**:
  - `uuid` (string): A randomly generated Version 4 UUID string (e.g., `f47ac10b-58cc-4372-a567-0e02b2c3d479`).

### Base64 Encode
- **Description**: Encodes input data into a Base64 string. Useful for transmitting binary data or complex objects in text-based formats (like JSON).
- **Parameters**:
  - `data` (any\*): The data to encode. Can be a string, number, boolean, object, or array.
- **Process**:
  - The input `data` is first converted to a JSON string using `JSON.stringify()`.
  - The resulting JSON string is then encoded into Base64.
- **Output**:
  - `output` (string): The Base64 encoded representation of the JSON-stringified input data.

### Base64 Decode
- **Description**: Decodes a Base64 encoded string back into its original JSON-parsed form.
- **Parameters**:
  - `data` (string\*): A Base64 encoded string, typically one generated by the `encodeBase64` action or representing JSON data.
- **Process**:
  - The input Base64 `data` is decoded into a string (expected to be UTF-8).
  - The decoded string is then parsed as JSON using `JSON.parse()`.
- **Output**:
  - `output` (any): The original data structure (object, array, string, number, boolean) obtained after Base64 decoding and JSON parsing.

## Security Considerations
- 🚨 **CRITICAL**: Review the initial Security Disclaimer. Do not use this integration for storing or transmitting highly sensitive information (like PII, financial data, credentials) without a thorough security review and potentially additional layers of protection.
- **Key Management**: Securely storing, managing, and rotating your encryption and HMAC keys is crucial and **outside the scope of this integration**. Consider using dedicated secret management solutions or [Botpress env variables](https://botpress.com/docs/variables#configuration-variables) AT LEAST. Never hardcode keys directly in your Botpress flows. Use configuration variables or secrets management.
- **Algorithm Choice**: Use strong, modern algorithms. `aes-256-cbc` is generally preferred over `aes-256-ecb` due to ECB's vulnerability to pattern analysis. For hashing, `sha256` or stronger is recommended (`md5` is considered insecure).
- **Data Sensitivity**: Understand the sensitivity of the data you are processing and apply appropriate cryptographic controls.

## Usage Recommendations
- **Encryption**: Use `Encrypt` for data confidentiality. Ensure you store the key securely and pass the entire `output` (IV + ciphertext) to the `Decrypt` action.
- **HMAC**: Use `HMAC` and `Verify HMAC` for data integrity and authenticity, ensuring messages haven't been tampered with and originate from a source possessing the secret key.
- **Hashing**: Use `Hash Data` for creating digests for comparison (e.g., password hashing - though use dedicated libraries like `bcrypt` for passwords if possible), checksums, or indexing.
- **Base64**: Use `encodeBase64`/`decodeBase64` primarily for encoding/decoding data for transport layers that require text, especially when dealing with JSON objects. It does **not** provide security, only encoding.
- **UUIDs**: Use `randomUuid` for generating unique identifiers for sessions, transactions, records, etc.

## Development and Testing

This integration includes a development environment managed by [Nix Flakes](https://nixos.wiki/wiki/Flakes) and tests written using [Jest](https://jestjs.io/).

1.  **Activate Development Environment**:
    *   Ensure you have Nix installed with Flakes enabled.
    *   Navigate to the project's root directory in your terminal.
    *   Run: `nix develop`
    *   This command drops you into a shell with Node.js, `bun` (or `npm`/`yarn`), and other dependencies available.

2.  **Install Dependencies**:
    *   Inside the `nix develop` shell, run:
        ```bash
        bun install
        # OR if you prefer npm:
        # npm install
        ```

3.  **Run Tests**:
    *   Inside the `nix develop` shell, run:
        ```bash
        bun run jest
        # OR if using npm:
        # npm test
        ```
    *   This command will execute all test files located in the `src/__tests__` directory.

## Limitations
- Supports only a subset of Node.js `crypto` algorithms and features.
- No built-in key management or rotation features.
- Assumes specific encoding for keys and data (primarily Base64 and UTF-8).
- Error handling provides basic information; detailed cryptographic errors might be nested within the RuntimeError message.

## About the Author
This integration is built and maintained by [Hanakano](https://www.hanakano.com), a Botpress Integration Partner!

## Contributing
This integration is open-source, and contributions are welcome! Please refer to the project repository for contribution guidelines.
- **Repository**: [`https://github.com/hanakano/bp-crypto`](https://github.com/hanakano/bp-crypto)
