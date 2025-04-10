import { jest } from '@jest/globals';
import { btoa } from '../actions/btoa';
import { mockLogger, resetMockLogger } from './mocks/logger';
import { RuntimeError } from '@botpress/client';

describe('btoa action', () => {
	beforeEach(() => {
		resetMockLogger();
	});

	it('should correctly encode a JSON object to base64', async () => {
		const inputObj = { message: 'encode me', value: 123 };
		const expectedBase64 = Buffer.from(JSON.stringify(inputObj)).toString('base64');

		const result = await btoa({
			input: { data: inputObj },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "btoa",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: expectedBase64 });
		expect(mockLogger.forBot).toHaveBeenCalled();
		expect(mockLogger.debug).toHaveBeenCalledWith('Encoding to base64:', { input: { data: inputObj } });
	});

	it('should correctly encode a simple string to base64', async () => {
		const inputStr = "just a string";
		// Note: The action stringifies the input first
		const expectedBase64 = Buffer.from(JSON.stringify(inputStr)).toString('base64');

		const result = await btoa({
			input: { data: inputStr },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "btoa",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: expectedBase64 });
	});

	it('should correctly encode an array to base64', async () => {
		const inputArr = [1, "test", true];
		const expectedBase64 = Buffer.from(JSON.stringify(inputArr)).toString('base64');

		const result = await btoa({
			input: { data: inputArr },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "btoa",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: expectedBase64 });
	});

	// Note: Testing circular references might be tricky as JSON.stringify handles some cases,
	// but a deep circular structure would throw an error. This depends on Node's behavior.
	// If needed, you could construct such an object:
	// const circularObj: any = { name: 'circular' };
	// circularObj.self = circularObj;
	// await expect(btoa({ input: { data: circularObj }, logger: mockLogger, ... })).rejects.toThrow(RuntimeError);
});
