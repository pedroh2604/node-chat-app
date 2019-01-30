var expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString() - String validation', () => {
	var testStrings = [123, '      ', 'hey'];

	it('should reject non string values', () => {
		expect(isRealString(testStrings[0])).toBe(false);
	});

	it('should reject strings with only spaces', () => {
		expect(isRealString(testStrings[1])).toBe(false);
	});

	it('should allow string with non-space characters', () => {
		expect(isRealString(testStrings[2])).toBe(true);
	});
});