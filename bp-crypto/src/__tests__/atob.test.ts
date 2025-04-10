import { jest } from '@jest/globals';
import { atob } from '../actions/atob';
import { mockLogger, resetMockLogger } from './mocks/logger'; // Adjust path if needed
import { RuntimeError } from '@botpress/client';

describe('atob action', () => {
	beforeEach(() => {
		resetMockLogger(); // Reset mocks before each test
	});

	it('should correctly decode a base64 string representing a JSON object', async () => {
		const inputObj = { message: 'hello world', count: 42 };
		const base64Data = Buffer.from(JSON.stringify(inputObj)).toString('base64');

		const result = await atob({
			input: { data: base64Data },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "atob",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual(inputObj);
		expect(mockLogger.forBot).toHaveBeenCalled();
		expect(mockLogger.debug).toHaveBeenCalledWith('Decoding from base64:', { input: { data: base64Data } });
	});

	it('should throw RuntimeError for invalid base64 input', async () => {
		const invalidBase64 = 'this is not base64!!!';

		await expect(
			atob({
				input: { data: invalidBase64 },
				logger: mockLogger as any,
				client: {} as any,
				ctx: {} as any,
				type: "atob",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);

		await expect(
			atob({
				input: { data: invalidBase64 },
				logger: mockLogger as any,
				client: {} as any,
				ctx: {} as any,
				type: "atob",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(/Error base64 decoding data/);
	});

	it('should throw RuntimeError if decoded string is not valid JSON', async () => {
		const nonJsonString = "this is just a string";
		const base64Data = Buffer.from(nonJsonString).toString('base64');

		await expect(
			atob({
				input: { data: base64Data },
				logger: mockLogger as any,
				client: {} as any,
				ctx: {} as any,
				type: "atob",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
		await expect(
			atob({
				input: { data: base64Data },
				logger: mockLogger as any,
				client: {} as any,
				ctx: {} as any,
				type: "atob",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(/Error base64 decoding data: SyntaxError/); // More specific error check
	});

	it('should handle base64 representation of non-object JSON (e.g., array, string)', async () => {
		const inputData = ["a", "b", 1];
		const base64Data = Buffer.from(JSON.stringify(inputData)).toString('base64');

		const result = await atob({
			input: { data: base64Data },
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "atob",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual(inputData);
	});
});
