/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable unicorn/no-null */

import { strict as assert } from "node:assert";

import {
	assertIdenticalTypes,
	createInstanceOf,
	exposeFromOpaqueJson,
	replaceBigInt,
	reviveBigInt,
} from "./testUtils.js";
import type { ObjectWithOptionalRecursion } from "./testValues.js";
import {
	boolean,
	number,
	string,
	numericEnumValue,
	NumericEnum,
	stringEnumValue,
	StringEnum,
	constHeterogenousEnumValue,
	ConstHeterogenousEnum,
	computedEnumValue,
	ComputedEnum,
	objectWithLiterals,
	arrayOfLiterals,
	tupleWithLiterals,
	symbol,
	uniqueSymbol,
	bigint,
	aFunction,
	unknownValueOfSimpleRecord,
	unknownValueWithBigint,
	voidValue,
	stringOrSymbol,
	bigintOrString,
	bigintOrSymbol,
	numberOrBigintOrSymbol,
	functionWithProperties,
	objectAndFunction,
	arrayOfNumbers,
	arrayOfNumbersSparse,
	arrayOfNumbersOrUndefined,
	arrayOfBigints,
	arrayOfSymbols,
	arrayOfUnknown,
	arrayOfFunctions,
	arrayOfFunctionsWithProperties,
	arrayOfObjectAndFunctions,
	arrayOfBigintOrObjects,
	arrayOfSymbolOrObjects,
	arrayOfBigintOrSymbols,
	arrayOfNumberBigintOrSymbols,
	readonlyArrayOfNumbers,
	readonlyArrayOfObjects,
	object,
	emptyObject,
	objectWithBoolean,
	objectWithNumber,
	objectWithString,
	objectWithSymbol,
	objectWithBigint,
	objectWithFunction,
	objectWithFunctionWithProperties,
	objectWithObjectAndFunction,
	objectWithBigintOrString,
	objectWithBigintOrSymbol,
	objectWithNumberOrBigintOrSymbol,
	objectWithFunctionOrSymbol,
	objectWithStringOrSymbol,
	objectWithUnknown,
	objectWithOptionalUnknown,
	objectWithUndefined,
	objectWithOptionalUndefined,
	objectWithOptionalBigint,
	objectWithNumberKey,
	objectWithSymbolKey,
	objectWithUniqueSymbolKey,
	objectWithArrayOfNumbers,
	objectWithArrayOfNumbersSparse,
	objectWithArrayOfNumbersOrUndefined,
	objectWithArrayOfBigints,
	objectWithArrayOfSymbols,
	objectWithArrayOfUnknown,
	objectWithArrayOfFunctions,
	objectWithArrayOfFunctionsWithProperties,
	objectWithArrayOfObjectAndFunctions,
	objectWithArrayOfBigintOrObjects,
	objectWithArrayOfSymbolOrObjects,
	objectWithReadonlyArrayOfNumbers,
	objectWithOptionalNumberNotPresent,
	objectWithOptionalNumberUndefined,
	objectWithOptionalNumberDefined,
	objectWithNumberOrUndefinedUndefined,
	objectWithNumberOrUndefinedNumbered,
	objectWithReadonly,
	objectWithReadonlyViaGetter,
	objectWithGetter,
	objectWithGetterViaValue,
	objectWithSetter,
	objectWithSetterViaValue,
	objectWithMatchedGetterAndSetterProperty,
	objectWithMatchedGetterAndSetterPropertyViaValue,
	objectWithMismatchedGetterAndSetterProperty,
	objectWithMismatchedGetterAndSetterPropertyViaValue,
	objectWithNever,
	stringRecordOfNumbers,
	stringRecordOfUndefined,
	stringRecordOfUnknown,
	stringOrNumberRecordOfStrings,
	stringOrNumberRecordOfObjects,
	partialStringRecordOfNumbers,
	partialStringRecordOfUnknown,
	templatedRecordOfNumbers,
	partialTemplatedRecordOfNumbers,
	templatedRecordOfUnknown,
	mixedRecordOfUnknown,
	stringRecordOfNumbersOrStringsWithKnownProperties,
	stringRecordOfUnknownWithKnownProperties,
	partialStringRecordOfUnknownWithKnownProperties,
	stringRecordOfUnknownWithOptionalKnownProperties,
	stringRecordOfUnknownWithKnownUnknown,
	stringRecordOfUnknownWithOptionalKnownUnknown,
	stringOrNumberRecordOfStringWithKnownNumber,
	stringOrNumberRecordOfUndefinedWithKnownNumber,
	objectWithPossibleRecursion,
	objectWithOptionalRecursion,
	objectWithEmbeddedRecursion,
	objectWithAlternatingRecursion,
	objectWithSymbolOrRecursion,
	objectWithFluidHandleOrRecursion,
	objectWithUnknownAdjacentToOptionalRecursion,
	objectWithOptionalUnknownAdjacentToOptionalRecursion,
	objectWithUnknownInOptionalRecursion,
	objectWithOptionalUnknownInOptionalRecursion,
	selfRecursiveFunctionWithProperties,
	selfRecursiveObjectAndFunction,
	objectInheritingOptionalRecursionAndWithNestedSymbol,
	simpleJson,
	simpleImmutableJson,
	jsonObject,
	immutableJsonObject,
	classInstanceWithPrivateData,
	classInstanceWithPrivateMethod,
	classInstanceWithPrivateGetter,
	classInstanceWithPrivateSetter,
	classInstanceWithPublicData,
	classInstanceWithPublicMethod,
	functionObjectWithPrivateData,
	functionObjectWithPublicData,
	classInstanceWithPrivateDataAndIsFunction,
	classInstanceWithPublicDataAndIsFunction,
	ClassWithPrivateData,
	ClassWithPrivateMethod,
	ClassWithPrivateGetter,
	ClassWithPrivateSetter,
	ClassWithPublicData,
	ClassWithPublicMethod,
	mapOfStringsToNumbers,
	readonlyMapOfStringsToNumbers,
	setOfNumbers,
	readonlySetOfNumbers,
	brandedNumber,
	brandedString,
	brandedObject,
	brandedObjectWithString,
	objectWithBrandedNumber,
	objectWithBrandedString,
	fluidHandleToNumber,
	objectWithFluidHandle,
	opaqueSerializableObject,
	opaqueDeserializedObject,
	opaqueSerializableAndDeserializedObject,
	opaqueSerializableObjectRequiringBigintSupport,
	opaqueDeserializedObjectRequiringBigintSupport,
	opaqueSerializableAndDeserializedObjectRequiringBigintSupport,
	opaqueSerializableObjectExpectingBigintSupport,
	opaqueDeserializedObjectExpectingBigintSupport,
	opaqueSerializableAndDeserializedObjectExpectingBigintSupport,
} from "./testValues.js";

import type { IFluidHandle } from "@fluidframework/core-interfaces";
import type {
	InternalUtilityTypes,
	JsonDeserialized,
	JsonTypeWith,
	NonNullJsonObjectWith,
	OpaqueJsonDeserialized,
} from "@fluidframework/core-interfaces/internal/exposedUtilityTypes";

/**
 * Defined using `JsonDeserialized` type filter tests `JsonDeserialized` at call site.
 * Internally, value given is round-tripped through JSON serialization to ensure it is
 * unchanged or converted to given optional value.
 *
 * @param v - value to pass through JSON serialization
 * @param expected - alternate value to compare against after round-trip
 * @returns the round-tripped value
 *
 * @remarks
 * `expected` parameter type would ideally be `JsonDeserialized<T>` but that
 * may influence the type inference of the test. So, instead, use `unknown`.
 */
function passThru<const T>(v: T, expected?: unknown): JsonDeserialized<T> {
	const stringified = JSON.stringify(v);
	if (stringified === undefined) {
		throw new Error("JSON.stringify returned undefined");
	}
	const result = JSON.parse(stringified) as JsonDeserialized<T>;
	assert.deepStrictEqual(result, expected ?? v);
	return result;
}

/**
 * Defined using `JsonDeserialized` type filter tests `JsonDeserialized` at call site.
 *
 * @remarks All uses are expect to trigger a compile-time error.
 *
 * @param v - value to pass through JSON serialization
 * @param error - error expected during serialization round-trip
 * @returns dummy result to allow further type checking
 */
function passThruThrows<const T>(v: T, expectedThrow: Error): JsonDeserialized<T> {
	assert.throws(() => passThru(v), expectedThrow);
	return undefined as unknown as JsonDeserialized<T>;
}

/**
 * Similar to {@link passThru} but specifically handles `bigint` values.
 */
function passThruHandlingBigint<const T>(
	v: T,
	expected?: unknown,
): JsonDeserialized<T, { AllowExactly: [bigint] }> {
	const stringified = JSON.stringify(v, replaceBigInt);
	if (stringified === undefined) {
		throw new Error("JSON.stringify returned undefined");
	}
	const result = JSON.parse(stringified, reviveBigInt) as JsonDeserialized<
		T,
		{ AllowExactly: [bigint] }
	>;
	assert.deepStrictEqual(result, expected ?? v);
	return result;
}

/**
 * Similar to {@link passThruThrows} but specifically handles `bigint` values.
 */
function passThruHandlingBigintThrows<const T>(
	v: T,
	expectedThrow: Error,
): JsonDeserialized<T, { AllowExactly: [bigint] }> {
	assert.throws(() => passThruHandlingBigint(v), expectedThrow);
	return undefined as unknown as JsonDeserialized<T, { AllowExactly: [bigint] }>;
}

/**
 * Similar to {@link passThru} but specifically handles certain function signatures.
 */
function passThruHandlingSpecificFunction<const T>(
	_v: T,
): JsonDeserialized<T, { AllowExactly: [(_: string) => number] }> {
	return undefined as unknown as JsonDeserialized<
		T,
		{ AllowExactly: [(_: string) => number] }
	>;
}

/**
 * Similar to {@link passThru} but specifically handles any Fluid handle.
 */
function passThruHandlingFluidHandle<const T>(
	_v: T,
): JsonDeserialized<T, { AllowExtensionOf: IFluidHandle }> {
	return undefined as unknown as JsonDeserialized<T, { AllowExtensionOf: IFluidHandle }>;
}

/**
 * Similar to {@link passThru} but preserves `unknown` instead of substituting `JsonTypeWith`.
 */
function passThruPreservingUnknown<const T>(
	_v: T,
): JsonDeserialized<T, { AllowExactly: [unknown] }> {
	return undefined as unknown as JsonDeserialized<T, { AllowExactly: [unknown] }>;
}

describe("JsonDeserialized", () => {
	describe("positive compilation tests", () => {
		describe("supported primitive types are preserved", () => {
			it("`boolean`", () => {
				const resultRead = passThru(boolean);
				assertIdenticalTypes(resultRead, boolean);
			});
			it("`number`", () => {
				const resultRead = passThru(number);
				assertIdenticalTypes(resultRead, number);
			});
			it("`string`", () => {
				const resultRead = passThru(string);
				assertIdenticalTypes(resultRead, string);
			});
			it("numeric enum", () => {
				const resultRead = passThru(numericEnumValue);
				assertIdenticalTypes(resultRead, numericEnumValue);
			});
			it("string enum", () => {
				const resultRead = passThru(stringEnumValue);
				assertIdenticalTypes(resultRead, stringEnumValue);
			});
			it("const heterogenous enum", () => {
				const resultRead = passThru(constHeterogenousEnumValue);
				assertIdenticalTypes(resultRead, constHeterogenousEnumValue);
			});
			it("computed enum", () => {
				const resultRead = passThru(computedEnumValue);
				assertIdenticalTypes(resultRead, computedEnumValue);
			});
			it("branded `number`", () => {
				const resultRead = passThru(brandedNumber);
				assertIdenticalTypes(resultRead, brandedNumber);
			});
			it("branded `string`", () => {
				const resultRead = passThru(brandedString);
				assertIdenticalTypes(resultRead, brandedString);
			});
		});

		describe("unions with unsupported primitive types preserve supported types", () => {
			it("`string | symbol`", () => {
				const resultRead = passThruThrows(
					stringOrSymbol,
					new Error("JSON.stringify returned undefined"),
				);
				assertIdenticalTypes(resultRead, string);
			});
			it("`bigint | string`", () => {
				const resultRead = passThru(bigintOrString);
				assertIdenticalTypes(resultRead, string);
			});
			it("`bigint | symbol`", () => {
				const resultRead = passThruThrows(
					bigintOrSymbol,
					new Error("JSON.stringify returned undefined"),
				);
				assertIdenticalTypes(resultRead, createInstanceOf<never>());
			});
			it("`number | bigint | symbol`", () => {
				const resultRead = passThru(numberOrBigintOrSymbol, 7);
				assertIdenticalTypes(resultRead, createInstanceOf<number>());
			});
		});

		describe("supported literal types are preserved", () => {
			it("`true`", () => {
				const resultRead = passThru(true as const);
				assertIdenticalTypes(resultRead, true);
			});
			it("`false`", () => {
				const resultRead = passThru(false as const);
				assertIdenticalTypes(resultRead, false);
			});
			it("`0`", () => {
				const resultRead = passThru(0 as const);
				assertIdenticalTypes(resultRead, 0);
			});
			it('"string"', () => {
				const resultRead = passThru("string" as const);
				assertIdenticalTypes(resultRead, "string");
			});
			it("`null`", () => {
				const resultRead = passThru(null);
				assertIdenticalTypes(resultRead, null);
			});
			it("object with literals", () => {
				const resultRead = passThru(objectWithLiterals);
				assertIdenticalTypes(resultRead, objectWithLiterals);
			});
			it("array of literals", () => {
				const resultRead = passThru(arrayOfLiterals);
				assertIdenticalTypes(resultRead, arrayOfLiterals);
			});
			it("tuple of literals", () => {
				const resultRead = passThru(tupleWithLiterals);
				assertIdenticalTypes(resultRead, tupleWithLiterals);
			});
			it("specific numeric enum value", () => {
				const resultRead = passThru(NumericEnum.two as const);
				assertIdenticalTypes(resultRead, NumericEnum.two);
			});
			it("specific string enum value", () => {
				const resultRead = passThru(StringEnum.b as const);
				assertIdenticalTypes(resultRead, StringEnum.b);
			});
			it("specific const heterogenous enum value", () => {
				const resultRead = passThru(ConstHeterogenousEnum.zero as const);
				assertIdenticalTypes(resultRead, ConstHeterogenousEnum.zero);
			});
			it("specific computed enum value", () => {
				const resultRead = passThru(ComputedEnum.computed as const);
				assertIdenticalTypes(resultRead, ComputedEnum.computed);
			});
		});

		describe("arrays", () => {
			it("array of supported types (numbers) are preserved", () => {
				const resultRead = passThru(arrayOfNumbers);
				assertIdenticalTypes(resultRead, arrayOfNumbers);
			});
			it("sparse array is filled in with null", () => {
				const resultRead = passThru(arrayOfNumbersSparse, [0, null, null, 3]);
				assertIdenticalTypes(resultRead, arrayOfNumbersSparse);
			});
			it("array of partially supported (numbers or undefined) is modified with null", () => {
				const resultRead = passThru(arrayOfNumbersOrUndefined, [0, null, 2]);
				assertIdenticalTypes(resultRead, createInstanceOf<(number | null)[]>());
			});
			it("array of `unknown` becomes array of `JsonTypeWith<never>`", () => {
				const resultRead = passThru(arrayOfUnknown);
				assertIdenticalTypes(resultRead, createInstanceOf<JsonTypeWith<never>[]>());
			});
			it("array of partially supported (bigint or basic object) becomes basic object only", () => {
				const resultRead = passThruThrows(
					arrayOfBigintOrObjects,
					new TypeError("Do not know how to serialize a BigInt"),
				);
				assertIdenticalTypes(resultRead, createInstanceOf<{ property: string }[]>());
			});
			it("array of partially supported (symbols or basic object) is modified with null", () => {
				const resultRead = passThru(arrayOfSymbolOrObjects, [null]);
				assertIdenticalTypes(resultRead, createInstanceOf<({ property: string } | null)[]>());
			});
			it("array of unsupported (bigint) becomes never[]", () => {
				const resultRead = passThruThrows(
					arrayOfBigints,
					new TypeError("Do not know how to serialize a BigInt"),
				);
				assertIdenticalTypes(resultRead, createInstanceOf<never[]>());
			});
			it("array of unsupported (symbols) becomes null[]", () => {
				const resultRead = passThru(arrayOfSymbols, [null]);
				assertIdenticalTypes(resultRead, createInstanceOf<null[]>());
			});
			it("array of unsupported (functions) becomes null[]", () => {
				const resultRead = passThru(arrayOfFunctions, [null]);
				assertIdenticalTypes(resultRead, createInstanceOf<null[]>());
			});
			it("array of functions with properties becomes ({...}|null)[]", () => {
				const resultRead = passThru(arrayOfFunctionsWithProperties, [null]);
				assertIdenticalTypes(resultRead, createInstanceOf<({ property: number } | null)[]>());
			});
			it("array of objects and functions becomes ({...}|null)[]", () => {
				const resultRead = passThru(arrayOfObjectAndFunctions, [{ property: 6 }]);
				assertIdenticalTypes(resultRead, createInstanceOf<({ property: number } | null)[]>());
			});
			it("array of `bigint | symbol` becomes null[]", () => {
				const resultRead = passThru(arrayOfBigintOrSymbols, [null]);
				assertIdenticalTypes(resultRead, createInstanceOf<null[]>());
			});
			it("array of `number | bigint | symbol` becomes (number|null)[]", () => {
				const resultRead = passThru(arrayOfNumberBigintOrSymbols, [7]);
				assertIdenticalTypes(resultRead, createInstanceOf<(number | null)[]>());
			});
			it("readonly array of supported types (numbers) are preserved", () => {
				const resultRead = passThru(readonlyArrayOfNumbers);
				assertIdenticalTypes(resultRead, readonlyArrayOfNumbers);
				// @ts-expect-error readonly array does not appear to support `push`, but works at runtime.
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				resultRead.push(0);
				assert.deepStrictEqual(resultRead, [...readonlyArrayOfNumbers, 0]);
			});
			it("readonly array of supported types (simple object) are preserved", () => {
				const resultRead = passThru(readonlyArrayOfObjects);
				assertIdenticalTypes(resultRead, readonlyArrayOfObjects);
				// @ts-expect-error readonly array does not appear to support `push`, but works at runtime.
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				resultRead.push("not even an object");
				assert.deepStrictEqual(resultRead, [...readonlyArrayOfObjects, "not even an object"]);
			});
		});

		describe("fully supported object types are preserved", () => {
			it("empty object", () => {
				const resultRead = passThru(emptyObject);
				assertIdenticalTypes(resultRead, emptyObject);
			});

			it("object with `boolean`", () => {
				const resultRead = passThru(objectWithBoolean);
				assertIdenticalTypes(resultRead, objectWithBoolean);
			});
			it("object with `number`", () => {
				const resultRead = passThru(objectWithNumber);
				assertIdenticalTypes(resultRead, objectWithNumber);
			});
			it("object with `string`", () => {
				const resultRead = passThru(objectWithString);
				assertIdenticalTypes(resultRead, objectWithString);
			});

			it("object with number key", () => {
				const resultRead = passThru(objectWithNumberKey);
				assertIdenticalTypes(resultRead, objectWithNumberKey);
			});

			it("object with array of supported types (numbers) are preserved", () => {
				const resultRead = passThru(objectWithArrayOfNumbers);
				assertIdenticalTypes(resultRead, objectWithArrayOfNumbers);
			});
			it("object with sparse array is filled in with null", () => {
				const resultRead = passThru(objectWithArrayOfNumbersSparse, {
					arrayOfNumbersSparse: [0, null, null, 3],
				});
				assertIdenticalTypes(resultRead, objectWithArrayOfNumbersSparse);
			});

			it("object with branded `number`", () => {
				const resultRead = passThru(objectWithBrandedNumber);
				assertIdenticalTypes(resultRead, objectWithBrandedNumber);
			});
			it("object with branded `string`", () => {
				const resultRead = passThru(objectWithBrandedString);
				assertIdenticalTypes(resultRead, objectWithBrandedString);
			});

			it("`string` indexed record of `number`s", () => {
				const resultRead = passThru(stringRecordOfNumbers);
				assertIdenticalTypes(resultRead, stringRecordOfNumbers);
			});
			it("`string`|`number` indexed record of `string`s", () => {
				const resultRead = passThru(stringOrNumberRecordOfStrings);
				assertIdenticalTypes(resultRead, stringOrNumberRecordOfStrings);
			});
			it("`string`|`number` indexed record of objects", () => {
				const resultRead = passThru(stringOrNumberRecordOfObjects);
				assertIdenticalTypes(resultRead, stringOrNumberRecordOfObjects);
			});
			it("`string` indexed record of `number`|`string`s with known properties", () => {
				const resultRead = passThru(stringRecordOfNumbersOrStringsWithKnownProperties);
				assertIdenticalTypes(resultRead, stringRecordOfNumbersOrStringsWithKnownProperties);
			});
			it("`string`|`number` indexed record of `strings` with known `number` property (unassignable)", () => {
				const resultRead = passThru(stringOrNumberRecordOfStringWithKnownNumber);
				assertIdenticalTypes(resultRead, stringOrNumberRecordOfStringWithKnownNumber);
			});
			it("`Partial<>` `string` indexed record of `numbers`", () => {
				// Warning: as of TypeScript 5.8.2, a Partial<> of an indexed type
				// gains `| undefined` even under exactOptionalPropertyTypes=true.
				// Preferred result is that there is no change applying Partial<>.
				// In either case, this test can hold since there isn't a downside
				// to allowing `undefined` in the result if that is how type is
				// given since indexed properties are always inherently optional.
				const resultRead = passThru(partialStringRecordOfNumbers, {
					key1: 0,
				});
				assertIdenticalTypes(resultRead, partialStringRecordOfNumbers);
			});
			it("templated record of `numbers`", () => {
				const resultRead = passThru(templatedRecordOfNumbers, {
					key1: 0,
				});
				assertIdenticalTypes(resultRead, templatedRecordOfNumbers);
			});
			it("`Partial<>` templated record of `numbers`", () => {
				// Warning: as of TypeScript 5.8.2, a Partial<> of an indexed type
				// gains `| undefined` even under exactOptionalPropertyTypes=true.
				// Preferred result is that there is no change applying Partial<>.
				// In either case, this test can hold since there isn't a downside
				// to allowing `undefined` in the result if that is how type is
				// given since indexed properties are always inherently optional.
				const resultRead = passThru(partialTemplatedRecordOfNumbers, {
					key1: 0,
				});
				assertIdenticalTypes(resultRead, partialTemplatedRecordOfNumbers);
			});

			it("object with possible type recursion through union", () => {
				const resultRead = passThru(objectWithPossibleRecursion);
				assertIdenticalTypes(resultRead, objectWithPossibleRecursion);
			});
			it("object with optional type recursion", () => {
				const resultRead = passThru(objectWithOptionalRecursion);
				assertIdenticalTypes(resultRead, objectWithOptionalRecursion);
			});
			it("object with deep type recursion", () => {
				const resultRead = passThru(objectWithEmbeddedRecursion);
				assertIdenticalTypes(resultRead, objectWithEmbeddedRecursion);
			});
			it("object with alternating type recursion", () => {
				const resultRead = passThru(objectWithAlternatingRecursion);
				assertIdenticalTypes(resultRead, objectWithAlternatingRecursion);
			});

			it("simple non-null object json (`NonNullJsonObjectWith<never>`)", () => {
				const resultRead = passThru(jsonObject);
				assertIdenticalTypes(resultRead, jsonObject);
			});
			it("simple read-only non-null object json (`ReadonlyNonNullJsonObjectWith<never>`)", () => {
				const resultRead = passThru(immutableJsonObject);
				assertIdenticalTypes(resultRead, immutableJsonObject);
			});

			it("non-const enum", () => {
				// Note: typescript doesn't do a great job checking that a filtered type satisfies an enum
				// type. The numeric indices are not checked. So far most robust inspection is manually
				// after any change.
				const resultNumericRead = passThru(NumericEnum);
				assertIdenticalTypes(resultNumericRead, NumericEnum);
				const resultStringRead = passThru(StringEnum);
				assertIdenticalTypes(resultStringRead, StringEnum);
				const resultComputedRead = passThru(ComputedEnum);
				assertIdenticalTypes(resultComputedRead, ComputedEnum);
			});

			it("object with `readonly`", () => {
				const resultRead = passThru(objectWithReadonly);
				assertIdenticalTypes(resultRead, objectWithReadonly);
			});

			it("object with getter implemented via value", () => {
				const resultRead = passThru(objectWithGetterViaValue);
				assertIdenticalTypes(resultRead, objectWithGetterViaValue);
			});
			it("object with setter implemented via value", () => {
				const resultRead = passThru(objectWithSetterViaValue);
				assertIdenticalTypes(resultRead, objectWithSetterViaValue);
			});
			it("object with matched getter and setter implemented via value", () => {
				const resultRead = passThru(objectWithMatchedGetterAndSetterPropertyViaValue);
				assertIdenticalTypes(resultRead, objectWithMatchedGetterAndSetterPropertyViaValue);
			});
			it("object with mismatched getter and setter implemented via value", () => {
				const resultRead = passThru(objectWithMismatchedGetterAndSetterPropertyViaValue);
				assertIdenticalTypes(resultRead, objectWithMismatchedGetterAndSetterPropertyViaValue);
				// @ts-expect-error 'number' is not assignable to type 'string'
				objectWithMismatchedGetterAndSetterPropertyViaValue.property = -1;
				// @ts-expect-error 'number' is not assignable to type 'string'
				resultRead.property = -1;
			});

			// Class instances are indistinguishable from general objects by type checking.
			// They are considered supported despite loss of instanceof support after
			// deserialization.
			describe("class instance", () => {
				it("with public data (propagated)", () => {
					const instanceRead = passThru(classInstanceWithPublicData, {
						public: "public",
					});
					assertIdenticalTypes(instanceRead, classInstanceWithPublicData);
					assert.ok(
						classInstanceWithPublicData instanceof ClassWithPublicData,
						"classInstanceWithPublicData is an instance of ClassWithPublicData",
					);
					assert.ok(
						!(instanceRead instanceof ClassWithPublicData),
						"instanceRead is not an instance of ClassWithPublicData",
					);
				});
			});

			describe("object with optional property (remains optional)", () => {
				it("without property", () => {
					const resultRead = passThru(objectWithOptionalNumberNotPresent);
					assertIdenticalTypes(resultRead, objectWithOptionalNumberNotPresent);
				});
				it("with undefined value (property is removed in value)", () => {
					const resultRead = passThru(objectWithOptionalNumberUndefined, {});
					assertIdenticalTypes(resultRead, objectWithOptionalNumberUndefined);
				});
				it("with defined value", () => {
					const resultRead = passThru(objectWithOptionalNumberDefined);
					assertIdenticalTypes(resultRead, objectWithOptionalNumberDefined);
				});
			});

			it("OpaqueJsonDeserialized<{number:number}>", () => {
				const resultRead = passThru(opaqueDeserializedObject);
				assertIdenticalTypes(resultRead, opaqueDeserializedObject);
				const transparentResult = exposeFromOpaqueJson(resultRead);
				assertIdenticalTypes(transparentResult, objectWithNumber);
			});
		});

		describe("partially supported object types are modified", () => {
			describe("fully unsupported properties are removed", () => {
				it("object with exactly `bigint`", () => {
					const resultRead = passThruThrows(
						objectWithBigint,
						new TypeError("Do not know how to serialize a BigInt"),
					);
					assertIdenticalTypes(resultRead, {});
					// @ts-expect-error `bigint` missing
					assertIdenticalTypes(resultRead, objectWithBigint);
				});
				it("object with exactly `symbol`", () => {
					const resultRead = passThru(objectWithSymbol, {});
					assertIdenticalTypes(resultRead, {});
					// @ts-expect-error `symbol` missing
					assertIdenticalTypes(resultRead, objectWithSymbol);
				});
				it("object with exactly function", () => {
					const resultRead = passThru(objectWithFunction, {});
					assertIdenticalTypes(resultRead, {});
					// @ts-expect-error `function` missing
					assertIdenticalTypes(resultRead, objectWithFunction);
				});
				it("object with exactly `Function | symbol`", () => {
					const resultRead = passThru(objectWithFunctionOrSymbol, {});
					assertIdenticalTypes(resultRead, {});
					// @ts-expect-error `functionOrSymbol` missing
					assertIdenticalTypes(resultRead, objectWithFunctionOrSymbol);
				});

				it("object with inherited recursion extended with unsupported properties", () => {
					const objectWithInheritedRecursionAndNestedSymbol = {
						outer: objectInheritingOptionalRecursionAndWithNestedSymbol,
					};
					const resultRead = passThru(objectWithInheritedRecursionAndNestedSymbol, {
						outer: {
							recursive: { recursive: { recursive: {} } },
							complex: { number: 0 },
						},
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							outer: {
								recursive?: ObjectWithOptionalRecursion;
								complex: { number: number };
							};
						}>(),
					);
				});

				it("object with required exact `undefined`", () => {
					const resultRead = passThru(objectWithUndefined, {});
					assertIdenticalTypes(resultRead, {});
					// @ts-expect-error `undef` property (required) should no longer exist
					resultRead satisfies typeof objectWithUndefined;
				});
				it("object with optional exact `undefined`", () => {
					const resultRead = passThru(objectWithOptionalUndefined, {});
					assertIdenticalTypes(resultRead, {});
					// @ts-expect-error `undef` property (required) should no longer exist
					assertIdenticalTypes(resultRead, objectWithOptionalUndefined);
				});
				it("object with exactly `never`", () => {
					const resultRead = passThru(objectWithNever);
					assertIdenticalTypes(resultRead, {});
					// @ts-expect-error `never` property (type never) should not be preserved
					resultRead satisfies typeof objectWithNever;
				});

				it("object with `symbol` key", () => {
					const resultRead = passThru(objectWithSymbolKey, {});
					assertIdenticalTypes(resultRead, {});
				});
				it("object with [unique] symbol key", () => {
					const resultRead = passThru(objectWithUniqueSymbolKey, {});
					assertIdenticalTypes(resultRead, {});
				});

				it("`string` indexed record of `undefined`", () => {
					const resultRead = passThru(stringRecordOfUndefined, {});
					assertIdenticalTypes(resultRead, {});
					// `Record<string, undefined>` has no required properties; so, result `{}` does satisfy original type.
					resultRead satisfies typeof stringRecordOfUndefined;
				});
				it("`string` indexed record of `undefined` and known `number` property (unassignable)", () => {
					const resultRead = passThru(stringOrNumberRecordOfUndefinedWithKnownNumber, {
						knownNumber: 4,
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							knownNumber: number;
						}>(),
					);
					// If this type were not unassignable to begin with, then result would
					// satisfy the original type.
					// @ts-expect-error Property 'knownNumber' is incompatible with index signature. Type 'number' is not assignable to type 'undefined'.
					resultRead satisfies typeof stringOrNumberRecordOfUndefinedWithKnownNumber;
				});
			});

			describe("partially unsupported properties become optional for those supported", () => {
				describe("object with `undefined`", () => {
					it("with undefined value", () => {
						const resultRead = passThru(objectWithNumberOrUndefinedUndefined, {});
						assertIdenticalTypes(
							resultRead,
							createInstanceOf<{
								numOrUndef?: number;
							}>(),
						);
					});

					it("with defined value", () => {
						const resultRead = passThru(objectWithNumberOrUndefinedNumbered);
						assertIdenticalTypes(
							resultRead,
							createInstanceOf<{
								numOrUndef?: number;
							}>(),
						);
					});
				});

				it("object with exactly `string | symbol`", () => {
					const resultRead = passThru(
						objectWithStringOrSymbol,
						// value is a symbol; so removed.
						{},
					);
					assertIdenticalTypes(resultRead, createInstanceOf<{ stringOrSymbol?: string }>());
					// @ts-expect-error { stringOrSymbol: string | symbol; } does not satisfy { stringOrSymbol?: string; }
					objectWithStringOrSymbol satisfies typeof resultRead;
				});
				it("object with exactly `bigint | string`", () => {
					const resultRead = passThru(
						objectWithBigintOrString,
						// value is a string; so no runtime error.
					);
					assertIdenticalTypes(resultRead, createInstanceOf<{ bigintOrString: string }>());
					// @ts-expect-error { bigintOrString: string | bigint } does not satisfy { bigintOrString: string }
					objectWithBigintOrString satisfies typeof resultRead;
				});
				it("object with exactly `bigint | symbol`", () => {
					const resultRead = passThru(objectWithBigintOrSymbol, {});
					assertIdenticalTypes(resultRead, {});
				});
				it("object with exactly `number | bigint | symbol`", () => {
					const resultRead = passThru(objectWithNumberOrBigintOrSymbol, {
						numberOrBigintOrSymbol: 7,
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{ numberOrBigintOrSymbol?: number }>(),
					);
				});

				it("object with recursion and `symbol` unrolls 4 times and then has generic Json", () => {
					const resultRead = passThru(objectWithSymbolOrRecursion, { recurse: {} });
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							recurse?: {
								recurse?: {
									recurse?: {
										recurse?: {
											recurse?: JsonTypeWith<never>;
										};
									};
								};
							};
						}>(),
					);
				});

				it("object with exactly function with properties", () => {
					const resultRead = passThru(objectWithFunctionWithProperties, {});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							function?: {
								property: number;
							};
						}>(),
					);
				});
				it("object with exactly object and function", () => {
					const resultRead = passThru(objectWithObjectAndFunction, {
						object: { property: 6 },
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							object?: {
								property: number;
							};
						}>(),
					);
				});
				it("object with function object with recursion", () => {
					const objectWithFunctionObjectAndRecursion = {
						outerFnOjb: selfRecursiveFunctionWithProperties,
					};
					const resultRead = passThru(objectWithFunctionObjectAndRecursion, {});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							outerFnOjb?: {
								recurse?: {
									recurse?: {
										recurse?: {
											recurse?: {
												recurse?: JsonTypeWith<never>;
											};
										};
									};
								};
							};
						}>(),
					);
				});
				it("object with object and function with recursion", () => {
					const objectWithObjectAndFunctionWithRecursion = {
						outerFnOjb: selfRecursiveObjectAndFunction,
					};
					const resultRead = passThru(objectWithObjectAndFunctionWithRecursion, {
						outerFnOjb: { recurse: {} },
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							outerFnOjb?: {
								recurse?: {
									recurse?: {
										recurse?: {
											recurse?: {
												recurse?: JsonTypeWith<never>;
											};
										};
									};
								};
							};
						}>(),
					);
				});
				it("object with required `unknown` in recursion when `unknown` is allowed unrolls 4 times with optional `unknown`", () => {
					const resultRead = passThruPreservingUnknown(objectWithUnknownInOptionalRecursion);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							unknown?: unknown;
							recurse?: {
								unknown?: unknown;
								recurse?: {
									unknown?: unknown;
									recurse?: {
										unknown?: unknown;
										recurse?: {
											unknown?: unknown;
											// This is JsonTypeWith<unknown> which is simply `unknown`.
											recurse?: unknown;
										};
									};
								};
							};
						}>(),
					);
				});
			});

			describe("partially supported array properties are modified like top-level arrays", () => {
				it("object with array of partially supported (numbers or undefined) is modified with null", () => {
					const resultRead = passThru(objectWithArrayOfNumbersOrUndefined, {
						arrayOfNumbersOrUndefined: [0, null, 2],
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{ arrayOfNumbersOrUndefined: (number | null)[] }>(),
					);
				});
				it("object with array of `unknown` becomes array of `JsonTypeWith<never>`", () => {
					const resultRead = passThru(objectWithArrayOfUnknown);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{ arrayOfUnknown: JsonTypeWith<never>[] }>(),
					);
				});
				it("object with array of partially supported (bigint or basic object) becomes basic object only", () => {
					const resultRead = passThruThrows(
						objectWithArrayOfBigintOrObjects,
						new TypeError("Do not know how to serialize a BigInt"),
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{ arrayOfBigintOrObjects: { property: string }[] }>(),
					);
				});
				it("object with array of partially supported (symbols or basic object) is modified with null", () => {
					const resultRead = passThru(objectWithArrayOfSymbolOrObjects, {
						arrayOfSymbolOrObjects: [null],
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{ arrayOfSymbolOrObjects: ({ property: string } | null)[] }>(),
					);
				});
				it("object with array of unsupported (bigint) becomes never[]", () => {
					const resultRead = passThruThrows(
						objectWithArrayOfBigints,
						new TypeError("Do not know how to serialize a BigInt"),
					);
					assertIdenticalTypes(resultRead, createInstanceOf<{ arrayOfBigints: never[] }>());
				});
				it("object with array of unsupported (symbols) becomes null[]", () => {
					const resultRead = passThru(objectWithArrayOfSymbols, { arrayOfSymbols: [null] });
					assertIdenticalTypes(resultRead, createInstanceOf<{ arrayOfSymbols: null[] }>());
				});
				it("object with array of unsupported (functions) becomes null[]", () => {
					const resultRead = passThru(objectWithArrayOfFunctions, {
						arrayOfFunctions: [null],
					});
					assertIdenticalTypes(resultRead, createInstanceOf<{ arrayOfFunctions: null[] }>());
				});
				it("object with array of functions with properties becomes ({...}|null)[]", () => {
					const resultRead = passThru(objectWithArrayOfFunctionsWithProperties, {
						arrayOfFunctionsWithProperties: [null],
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							arrayOfFunctionsWithProperties: ({ property: number } | null)[];
						}>(),
					);
				});
				it("object with array of objects and functions becomes ({...}|null)[]", () => {
					const resultRead = passThru(objectWithArrayOfObjectAndFunctions, {
						arrayOfObjectAndFunctions: [{ property: 6 }],
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{ arrayOfObjectAndFunctions: ({ property: number } | null)[] }>(),
					);
				});
				it("object with array of `bigint | symbol` becomes null[]", () => {
					const objectWithArrayOfBigintOrSymbols = { array: [bigintOrSymbol] };
					const resultRead = passThru(objectWithArrayOfBigintOrSymbols, { array: [null] });
					assertIdenticalTypes(resultRead, createInstanceOf<{ array: null[] }>());
				});
				it("object with array of `number | bigint | symbol` becomes (number|null)[]", () => {
					const objectWithArrayOfNumberBigintOrSymbols = { array: [numberOrBigintOrSymbol] };
					const resultRead = passThru(objectWithArrayOfNumberBigintOrSymbols, { array: [7] });
					assertIdenticalTypes(resultRead, createInstanceOf<{ array: (number | null)[] }>());
				});
				it("object with readonly array of supported types (numbers) are preserved", () => {
					const resultRead = passThru(objectWithReadonlyArrayOfNumbers);
					assertIdenticalTypes(resultRead, objectWithReadonlyArrayOfNumbers);
					// @ts-expect-error readonly array does not appear to support `push`, but works at runtime.
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					resultRead.readonlyArrayOfNumbers.push(0);
					assert.deepStrictEqual(resultRead.readonlyArrayOfNumbers, [
						...objectWithReadonlyArrayOfNumbers.readonlyArrayOfNumbers,
						0,
					]);
				});
			});

			describe("function & object intersections preserve object portion", () => {
				it("function with properties", () => {
					const resultRead = passThruThrows(
						functionWithProperties,
						new Error("JSON.stringify returned undefined"),
					);
					assertIdenticalTypes(resultRead, createInstanceOf<{ property: number }>());
				});
				it("object and function", () => {
					const resultRead = passThru(objectAndFunction, { property: 6 });
					assertIdenticalTypes(resultRead, createInstanceOf<{ property: number }>());
				});
				it("function with class instance with private data", () => {
					const resultRead = passThruThrows(
						functionObjectWithPrivateData,
						new Error("JSON.stringify returned undefined"),
					);
					assertIdenticalTypes(resultRead, createInstanceOf<{ public: string }>());
				});
				it("function with class instance with public data", () => {
					const resultRead = passThruThrows(
						functionObjectWithPublicData,
						new Error("JSON.stringify returned undefined"),
					);
					assertIdenticalTypes(resultRead, createInstanceOf<{ public: string }>());
				});
				it("class instance with private data and is function", () => {
					const resultRead = passThru(classInstanceWithPrivateDataAndIsFunction, {
						public: "public",
						// secret is also not allowed but is present
						secret: 0,
					});
					assertIdenticalTypes(resultRead, createInstanceOf<{ public: string }>());
					// Keep this assert at end of scope to avoid assertion altering type
					const varTypeof = typeof classInstanceWithPrivateDataAndIsFunction;
					assert(
						varTypeof === "object",
						"class instance that is also a function is an object at runtime",
					);
				});
				it("class instance with public data and is function", () => {
					const resultRead = passThru(classInstanceWithPublicDataAndIsFunction, {
						public: "public",
					});
					assertIdenticalTypes(resultRead, createInstanceOf<{ public: string }>());
				});
				it("function object with recursion", () => {
					const resultRead = passThruThrows(
						selfRecursiveFunctionWithProperties,
						new Error("JSON.stringify returned undefined"),
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							recurse?: {
								recurse?: {
									recurse?: {
										recurse?: {
											recurse?: JsonTypeWith<never>;
										};
									};
								};
							};
						}>(),
					);
				});
				it("object and function with recursion", () => {
					const resultRead = passThru(selfRecursiveObjectAndFunction, { recurse: {} });
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							recurse?: {
								recurse?: {
									recurse?: {
										recurse?: {
											recurse?: JsonTypeWith<never>;
										};
									};
								};
							};
						}>(),
					);
				});
			});

			// Class instances are indistinguishable from general objects by type checking.
			// They are considered supported despite loss of instanceof support after
			// deserialization.
			describe("class instance methods and non-public properties are removed", () => {
				it("with public method (removes method)", () => {
					const instanceRead = passThru(classInstanceWithPublicMethod, {
						public: "public",
					});
					assertIdenticalTypes(
						instanceRead,
						createInstanceOf<{
							public: string;
						}>(),
					);
					// @ts-expect-error getSecret is missing, but required
					instanceRead satisfies typeof classInstanceWithPublicMethod;
					// @ts-expect-error getSecret is missing, but required
					assertIdenticalTypes(instanceRead, classInstanceWithPublicMethod);
					assert.ok(
						classInstanceWithPublicMethod instanceof ClassWithPublicMethod,
						"classInstanceWithPublicMethod is an instance of ClassWithPublicMethod",
					);
					assert.ok(
						!(instanceRead instanceof ClassWithPublicMethod),
						"instanceRead is not an instance of ClassWithPublicMethod",
					);
				});
				it("with private method (removes method)", () => {
					const instanceRead = passThru(classInstanceWithPrivateMethod, {
						public: "public",
					});
					assertIdenticalTypes(
						instanceRead,
						createInstanceOf<{
							public: string;
						}>(),
					);
					// @ts-expect-error getSecret is missing, but required
					instanceRead satisfies typeof classInstanceWithPrivateMethod;
					// @ts-expect-error getSecret is missing, but required
					assertIdenticalTypes(instanceRead, classInstanceWithPrivateMethod);
					assert.ok(
						classInstanceWithPrivateMethod instanceof ClassWithPrivateMethod,
						"classInstanceWithPrivateMethod is an instance of ClassWithPrivateMethod",
					);
					assert.ok(
						!(instanceRead instanceof ClassWithPrivateMethod),
						"instanceRead is not an instance of ClassWithPrivateMethod",
					);
				});
				it("with private getter (removes getter)", () => {
					const instanceRead = passThru(classInstanceWithPrivateGetter, {
						public: "public",
					});
					assertIdenticalTypes(
						instanceRead,
						createInstanceOf<{
							public: string;
						}>(),
					);
					// @ts-expect-error secret is missing, but required
					instanceRead satisfies typeof classInstanceWithPrivateGetter;
					// @ts-expect-error secret is missing, but required
					assertIdenticalTypes(instanceRead, classInstanceWithPrivateGetter);
					assert.ok(
						classInstanceWithPrivateGetter instanceof ClassWithPrivateGetter,
						"classInstanceWithPrivateGetter is an instance of ClassWithPrivateGetter",
					);
					assert.ok(
						!(instanceRead instanceof ClassWithPrivateGetter),
						"instanceRead is not an instance of ClassWithPrivateGetter",
					);
				});
				it("with private setter (removes setter)", () => {
					const instanceRead = passThru(classInstanceWithPrivateSetter, {
						public: "public",
					});
					assertIdenticalTypes(
						instanceRead,
						createInstanceOf<{
							public: string;
						}>(),
					);
					// @ts-expect-error secret is missing, but required
					instanceRead satisfies typeof classInstanceWithPrivateSetter;
					// @ts-expect-error secret is missing, but required
					assertIdenticalTypes(instanceRead, classInstanceWithPrivateSetter);
					assert.ok(
						classInstanceWithPrivateSetter instanceof ClassWithPrivateSetter,
						"classInstanceWithPrivateSetter is an instance of ClassWithPrivateSetter",
					);
					assert.ok(
						!(instanceRead instanceof ClassWithPrivateSetter),
						"instanceRead is not an instance of ClassWithPrivateSetter",
					);
				});
				it("with private data (hides private data that propagates)", () => {
					const instanceRead = passThru(classInstanceWithPrivateData, {
						public: "public",
						secret: 0,
					});
					assertIdenticalTypes(
						instanceRead,
						createInstanceOf<{
							public: string;
						}>(),
					);
					// @ts-expect-error secret is missing, but required
					instanceRead satisfies typeof classInstanceWithPrivateData;
					// @ts-expect-error secret is missing, but required
					assertIdenticalTypes(instanceRead, classInstanceWithPrivateData);
					assert.ok(
						classInstanceWithPrivateData instanceof ClassWithPrivateData,
						"classInstanceWithPrivateData is an instance of ClassWithPrivateData",
					);
					assert.ok(
						!(instanceRead instanceof ClassWithPrivateData),
						"instanceRead is not an instance of ClassWithPrivateData",
					);
				});
				it("object with recursion and handle unrolls 4 times listing public properties and then has generic Json", () => {
					const resultRead = passThru(objectWithFluidHandleOrRecursion, {
						recurseToHandle: { recurseToHandle: "fake-handle" },
					});
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							recurseToHandle:
								| {
										recurseToHandle:
											| {
													recurseToHandle:
														| {
																recurseToHandle:
																	| {
																			recurseToHandle:
																				| JsonTypeWith<never>
																				| {
																						readonly isAttached: boolean;
																				  };
																	  }
																	| {
																			readonly isAttached: boolean;
																	  };
														  }
														| {
																readonly isAttached: boolean;
														  };
											  }
											| {
													readonly isAttached: boolean;
											  };
								  }
								| {
										readonly isAttached: boolean;
								  };
						}>(),
					);
				});

				describe("for common class instance of", () => {
					it("Map", () => {
						const instanceRead = passThru(mapOfStringsToNumbers, {});
						assertIdenticalTypes(instanceRead, {
							size: number,
						} as const);
						// @ts-expect-error methods are missing, but required
						instanceRead satisfies typeof mapOfStringsToNumbers;
						// @ts-expect-error methods are missing, but required
						assertIdenticalTypes(instanceRead, mapOfStringsToNumbers);
						assert.ok(
							mapOfStringsToNumbers instanceof Map,
							"mapOfStringsToNumbers is an instance of Map",
						);
						assert.ok(
							!(instanceRead instanceof Map),
							"instanceRead is not an instance of Map",
						);
					});
					it("ReadonlyMap", () => {
						const instanceRead = passThru(readonlyMapOfStringsToNumbers, {});
						assertIdenticalTypes(instanceRead, {
							size: number,
						} as const);
						// @ts-expect-error methods are missing, but required
						instanceRead satisfies typeof readonlyMapOfStringsToNumbers;
						// @ts-expect-error methods are missing, but required
						assertIdenticalTypes(instanceRead, readonlyMapOfStringsToNumbers);
						assert.ok(
							mapOfStringsToNumbers instanceof Map,
							"mapOfStringsToNumbers is an instance of Map",
						);
						assert.ok(
							!(instanceRead instanceof Map),
							"instanceRead is not an instance of Map",
						);
					});
					it("Set", () => {
						const instanceRead = passThru(setOfNumbers, {});
						assertIdenticalTypes(instanceRead, {
							size: number,
						} as const);
						// @ts-expect-error methods are missing, but required
						instanceRead satisfies typeof setOfNumbers;
						// @ts-expect-error methods are missing, but required
						assertIdenticalTypes(instanceRead, setOfNumbers);
						assert.ok(
							setOfNumbers instanceof Set,
							"mapOfStringsToNumbers is an instance of Set",
						);
						assert.ok(
							!(instanceRead instanceof Set),
							"instanceRead is not an instance of Set",
						);
					});
					it("ReadonlySet", () => {
						const instanceRead = passThru(readonlySetOfNumbers, {});
						assertIdenticalTypes(instanceRead, {
							size: number,
						} as const);
						// @ts-expect-error methods are missing, but required
						instanceRead satisfies typeof readonlySetOfNumbers;
						// @ts-expect-error methods are missing, but required
						assertIdenticalTypes(instanceRead, readonlySetOfNumbers);
						assert.ok(
							setOfNumbers instanceof Set,
							"mapOfStringsToNumbers is an instance of Set",
						);
						assert.ok(
							!(instanceRead instanceof Set),
							"instanceRead is not an instance of Set",
						);
					});
				});
			});

			describe("branded non-primitive types lose branding", () => {
				// Ideally there could be a transformation to JsonTypeWith<never> but
				// `object` intersected with branding (which is an object) is just the branding.
				it("branded `object` becomes just empty", () => {
					const resultRead = passThru(brandedObject);
					assertIdenticalTypes(resultRead, emptyObject);
				});
				it("branded object with `string`", () => {
					const resultRead = passThru(brandedObjectWithString);
					assertIdenticalTypes(resultRead, objectWithString);
				});
			});

			it("`object` (plain object) becomes non-null Json object", () => {
				const resultRead = passThru(
					object,
					// object's value is actually supported; so, no runtime error.
				);
				assertIdenticalTypes(resultRead, createInstanceOf<NonNullJsonObjectWith<never>>());
			});

			describe("OpaqueJsonSerialized becomes OpaqueJsonDeserialized counterpart", () => {
				it("OpaqueJsonSerializable<{number:number}> becomes OpaqueJsonDeserialized<{number:number}>", () => {
					const resultRead = passThru(opaqueSerializableObject);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<OpaqueJsonDeserialized<{ number: number }>>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, objectWithNumber);
				});
				it("OpaqueJsonSerializable<{number:number}>&OpaqueJsonDeserialized<{number:number}> becomes OpaqueJsonDeserialized<{number:number}>", () => {
					const resultRead = passThru(opaqueSerializableAndDeserializedObject);

					assertIdenticalTypes(
						resultRead,
						createInstanceOf<OpaqueJsonDeserialized<{ number: number }>>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, objectWithNumber);
				});
			});

			describe("opaque Json types requiring extra allowed types have extras removed", () => {
				it("opaque serializable object with `bigint`", () => {
					const resultRead = passThruThrows(
						opaqueSerializableObjectRequiringBigintSupport,
						new TypeError("Do not know how to serialize a BigInt"),
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<OpaqueJsonDeserialized<{ bigint: bigint }>>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, {});
				});
				it("opaque deserialized object with `bigint`", () => {
					const resultRead = passThruThrows(
						opaqueDeserializedObjectRequiringBigintSupport,
						new TypeError("Do not know how to serialize a BigInt"),
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<OpaqueJsonDeserialized<{ bigint: bigint }>>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, {});
				});
				it("opaque serializable and deserialized object with `bigint`", () => {
					const resultRead = passThruThrows(
						opaqueSerializableAndDeserializedObjectRequiringBigintSupport,
						new TypeError("Do not know how to serialize a BigInt"),
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<OpaqueJsonDeserialized<{ bigint: bigint }>>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, {});
				});

				it("opaque serializable object with number array expecting `bigint` support", () => {
					const resultRead = passThru(opaqueSerializableObjectExpectingBigintSupport);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<
							OpaqueJsonDeserialized<{ readonlyArrayOfNumbers: readonly number[] }>
						>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, objectWithReadonlyArrayOfNumbers);
				});
				it("opaque deserialized object with number array expecting `bigint` support", () => {
					const resultRead = passThru(opaqueDeserializedObjectExpectingBigintSupport);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<
							OpaqueJsonDeserialized<{ readonlyArrayOfNumbers: readonly number[] }>
						>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, objectWithReadonlyArrayOfNumbers);
				});
				it("opaque serializable and deserialized object with number array expecting `bigint` support", () => {
					const resultRead = passThru(
						opaqueSerializableAndDeserializedObjectExpectingBigintSupport,
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<
							OpaqueJsonDeserialized<{ readonlyArrayOfNumbers: readonly number[] }>
						>(),
					);
					const transparentResult = exposeFromOpaqueJson(resultRead);
					assertIdenticalTypes(transparentResult, objectWithReadonlyArrayOfNumbers);
				});
			});
		});

		describe("fully supported union types are preserved", () => {
			it("simple json (`JsonTypeWith<never>`)", () => {
				const resultRead = passThru(simpleJson);
				assertIdenticalTypes(resultRead, simpleJson);
			});
			it("simple read-only json (`ReadonlyJsonTypeWith<never>`)", () => {
				const resultRead = passThru(simpleImmutableJson);
				assertIdenticalTypes(resultRead, simpleImmutableJson);
			});
		});

		describe("unsupported object types", () => {
			// These cases are demonstrating defects within the current implementation.
			// They show "allowed" incorrect use and the unexpected results.
			describe("known defect expectations", () => {
				describe("getters and setters preserved but do not propagate", () => {
					it("object with `readonly` implemented via getter", () => {
						const resultRead = passThru(objectWithReadonlyViaGetter, {});
						assertIdenticalTypes(resultRead, objectWithReadonlyViaGetter);
					});

					it("object with getter", () => {
						const resultRead = passThru(objectWithGetter, {});
						assertIdenticalTypes(resultRead, objectWithGetter);

						assert.throws(() => {
							// @ts-expect-error Cannot assign to 'getter' because it is a read-only property.
							objectWithGetter.getter = -1;
						}, new TypeError(
							"Cannot set property getter of #<ClassImplementsObjectWithGetter> which has only a getter",
						));
						// @ts-expect-error Cannot assign to 'getter' because it is a read-only property.
						resultRead.getter = -1;
					});

					it("object with setter", () => {
						const resultRead = passThru(objectWithSetter, {});
						assertIdenticalTypes(resultRead, objectWithSetter);

						// Read from setter only produces `undefined` but is typed as `string`.
						const originalSetterValue = objectWithSetter.setter;
						assert.equal(originalSetterValue, undefined);
						// Read from deserialized is the same, but only per lack of propagation.
						const resultSetterValue = resultRead.setter;
						assert.equal(resultSetterValue, undefined);

						assert.throws(() => {
							// @ts-expect-error 'number' is not assignable to type 'string'
							objectWithSetter.setter = -1;
						}, new Error("ClassImplementsObjectWithSetter writing 'setter' as -1"));
						// @ts-expect-error 'number' is not assignable to type 'string'
						resultRead.setter = -1;
					});

					it("object with matched getter and setter", () => {
						const resultRead = passThru(objectWithMatchedGetterAndSetterProperty, {});
						assertIdenticalTypes(resultRead, objectWithMatchedGetterAndSetterProperty);
					});

					it("object with mismatched getter and setter", () => {
						const resultRead = passThru(objectWithMismatchedGetterAndSetterProperty, {});
						assertIdenticalTypes(resultRead, objectWithMismatchedGetterAndSetterProperty);

						// @ts-expect-error 'number' is not assignable to type 'string'
						resultRead.property = -1;
						assert.throws(() => {
							// @ts-expect-error 'number' is not assignable to type 'string'
							objectWithMismatchedGetterAndSetterProperty.property = -1;
						}, new Error(
							"ClassImplementsObjectWithMismatchedGetterAndSetterProperty writing 'property' as -1",
						));
					});
				});

				it("array of numbers with holes", () => {
					const resultRead = passThru(arrayOfNumbersSparse, [0, null, null, 3]);
					assertIdenticalTypes(resultRead, arrayOfNumbersSparse);
				});
			});
		});
	});

	// These test cases are not really negative compilation test like they are to JsonSerializable.
	// These cases are for instances of notable loss of original information.
	describe("negative compilation tests", () => {
		describe("assumptions", () => {
			it("const enums are never readable", () => {
				// ... and thus don't need accounted for by JsonDeserialized.

				const enum LocalConstHeterogenousEnum {
					zero,
					a = "a",
				}

				assert.throws(() => {
					// @ts-expect-error `const enums` are not accessible for reading
					passThru(LocalConstHeterogenousEnum);
				}, new ReferenceError("LocalConstHeterogenousEnum is not defined"));

				/**
				 * In CommonJs, an imported const enum becomes undefined. Only
				 * local const enums are inaccessible. To avoid building special
				 * support for both ESM and CommonJS, this helper allows calling
				 * with undefined (for CommonJS) and simulates the error that
				 * is expected on ESM.
				 * Importantly `undefined` is not expected to be serializable and
				 * thus is always a problem.
				 */
				function doNothingPassThru<T>(v: T): never {
					if (v === undefined) {
						throw new ReferenceError(`ConstHeterogenousEnum is not defined`);
					}
					throw new Error("Internal test error - should not reach here");
				}

				assert.throws(() => {
					// @ts-expect-error `const enums` are not accessible for reading
					doNothingPassThru(ConstHeterogenousEnum);
				}, new ReferenceError("ConstHeterogenousEnum is not defined"));
			});
		});

		describe("unsupported types", () => {
			it("`undefined` becomes `never`", () => {
				passThruThrows(
					undefined,
					new Error("JSON.stringify returned undefined"),
				) satisfies never;
			});
			it("`unknown` becomes `JsonTypeWith<never>`", () => {
				const resultRead = passThru(
					unknownValueOfSimpleRecord,
					// value is actually supported; so, no runtime error.
				);
				assertIdenticalTypes(resultRead, createInstanceOf<JsonTypeWith<never>>());
			});
			it("`string` indexed record of `unknown` replaced with `JsonTypeWith<never>` (and becomes optional per current TS behavior)", () => {
				const resultRead = passThru(stringRecordOfUnknown);
				assertIdenticalTypes(
					resultRead,
					// Note: as of TypeScript 5.8.2, a Partial<> of an indexed type
					// gains `| undefined` even under exactOptionalPropertyTypes=true.
					// Preferred result is that there is no change applying Partial<>.
					// In either case, this test hold since indexed properties are
					// always inherently optional.
					createInstanceOf<Partial<Record<string, JsonTypeWith<never>>>>(),
				);
			});
			it("templated record of `unknown` replaced with `JsonTypeWith<never>` (and becomes optional per current TS behavior)", () => {
				const resultRead = passThru(templatedRecordOfUnknown);
				assertIdenticalTypes(
					resultRead,
					// Note: as of TypeScript 5.8.2, a Partial<> of an indexed type
					// gains `| undefined` even under exactOptionalPropertyTypes=true.
					// Preferred result is that there is no change applying Partial<>.
					// In either case, this test hold since indexed properties are
					// always inherently optional.
					createInstanceOf<Partial<Record<`${string}Key`, JsonTypeWith<never>>>>(),
				);
			});
			it("`string` indexed record of `unknown` and known properties has `unknown` replaced with `JsonTypeWith<never>` (and becomes optional per current TS behavior)", () => {
				const resultRead = passThru(stringRecordOfUnknownWithKnownProperties);
				assertIdenticalTypes(
					resultRead,
					createInstanceOf<
						InternalUtilityTypes.FlattenIntersection<
							// Note: as of TypeScript 5.8.2, a Partial<> of an indexed type
							// gains `| undefined` even under exactOptionalPropertyTypes=true.
							// Preferred result is that there is no change applying Partial<>.
							// In either case, this test hold since indexed properties are
							// always inherently optional.
							Partial<Record<string, JsonTypeWith<never>>> & {
								knownString: string;
								knownNumber: number;
							}
						>
					>(),
				);
			});
			it("`string` indexed record of `unknown` and optional known properties has `unknown` replaced with `JsonTypeWith<never>` (and becomes optional per current TS behavior)", () => {
				const resultRead = passThru(stringRecordOfUnknownWithOptionalKnownProperties, {
					knownString: "string value",
				});
				assertIdenticalTypes(
					resultRead,
					createInstanceOf<
						InternalUtilityTypes.FlattenIntersection<
							// Note: as of TypeScript 5.8.2, a Partial<> of an indexed type
							// gains `| undefined` even under exactOptionalPropertyTypes=true.
							// Preferred result is that there is no change applying Partial<>.
							// In either case, this test hold since indexed properties are
							// always inherently optional.
							Partial<Record<string, JsonTypeWith<never>>> & {
								knownString?: string;
								knownNumber?: number;
							}
						>
					>(),
				);
			});
			it("`string` indexed record of `unknown` and required known `unknown` has all `unknown` replaced with `JsonTypeWith<never>` (and known becomes explicitly optional)", () => {
				const resultRead = passThru(stringRecordOfUnknownWithKnownUnknown);
				assertIdenticalTypes(
					resultRead,
					createInstanceOf<
						InternalUtilityTypes.FlattenIntersection<
							// Note: as of TypeScript 5.8.2, a Partial<> of an indexed type
							// gains `| undefined` even under exactOptionalPropertyTypes=true.
							// Preferred result is that there is no change applying Partial<>.
							// In either case, this test hold since indexed properties are
							// always inherently optional.
							Partial<Record<string, JsonTypeWith<never>>> & {
								knownUnknown?: JsonTypeWith<never>;
							}
						>
					>(),
				);
			});
			it("`string` indexed record of `unknown` and optional known `unknown` has all `unknown` replaced with `JsonTypeWith<never>` (and becomes optional per current TS behavior)", () => {
				const resultRead = passThru(stringRecordOfUnknownWithOptionalKnownUnknown);
				assertIdenticalTypes(
					resultRead,
					createInstanceOf<
						InternalUtilityTypes.FlattenIntersection<
							// Note: as of TypeScript 5.8.2, a Partial<> of an indexed type
							// gains `| undefined` even under exactOptionalPropertyTypes=true.
							// Preferred result is that there is no change applying Partial<>.
							// In either case, this test hold since indexed properties are
							// always inherently optional.
							Partial<Record<string, JsonTypeWith<never>>> & {
								knownUnknown?: JsonTypeWith<never>;
							}
						>
					>(),
				);
			});
			it("`Partial<>` `string` indexed record of `unknown` replaced with `JsonTypeWith<never>`", () => {
				const resultRead = passThru(partialStringRecordOfUnknown);
				assertIdenticalTypes(
					resultRead,
					// Warning: as of TypeScript 5.8.2, a Partial<> of an indexed type
					// gains `| undefined` even under exactOptionalPropertyTypes=true.
					// Preferred result is that there is no change applying Partial<>.
					// In either case, this test can hold since there isn't a downside
					// to allowing `undefined` in the result if that is how type is
					// given since indexed properties are always inherently optional.
					createInstanceOf<Partial<Record<string, JsonTypeWith<never>>>>(),
				);
			});
			it("`Partial<>` `string` indexed record of `unknown` and known properties has `unknown` replaced with `JsonTypeWith<never>`", () => {
				const resultRead = passThru(partialStringRecordOfUnknownWithKnownProperties);
				assertIdenticalTypes(
					resultRead,
					createInstanceOf<
						InternalUtilityTypes.FlattenIntersection<
							// Warning: as of TypeScript 5.8.2, a Partial<> of an indexed type
							// gains `| undefined` even under exactOptionalPropertyTypes=true.
							// Preferred result is that there is no change applying Partial<>.
							// In either case, this test can hold since there isn't a downside
							// to allowing `undefined` in the result if that is how type is
							// given since indexed properties are always inherently optional.
							Partial<Record<string, JsonTypeWith<never>>> & {
								knownString: string;
								knownNumber: number;
							}
						>
					>(),
				);
			});
			it("`symbol` becomes `never`", () => {
				passThruThrows(symbol, new Error("JSON.stringify returned undefined")) satisfies never;
			});
			it("`unique symbol` becomes `never`", () => {
				passThruThrows(
					uniqueSymbol,
					new Error("JSON.stringify returned undefined"),
				) satisfies never;
			});
			it("`bigint` becomes `never`", () => {
				passThruThrows(
					bigint,
					new TypeError("Do not know how to serialize a BigInt"),
				) satisfies never;
			});
			it("function becomes `never`", () => {
				passThruThrows(
					aFunction,
					new Error("JSON.stringify returned undefined"),
				) satisfies never;
			});
			it("`void` becomes `never`", () => {
				passThru(
					voidValue,
					// voidValue is actually `null`; so, no runtime error.
				) satisfies never;
			});
		});
	});

	describe("special cases", () => {
		it("explicit `any` generic limits result type", () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const resultRead = passThruThrows<any>(
				undefined,
				new Error("JSON.stringify returned undefined"),
			);
			assertIdenticalTypes(resultRead, createInstanceOf<JsonTypeWith<never>>());
		});

		describe("using alternately allowed types", () => {
			describe("are preserved", () => {
				it("`bigint`", () => {
					const resultRead = passThruHandlingBigint(bigint);
					assertIdenticalTypes(resultRead, createInstanceOf<bigint>());
				});
				it("object with `bigint`", () => {
					const resultRead = passThruHandlingBigint(objectWithBigint);
					assertIdenticalTypes(resultRead, objectWithBigint);
				});
				it("object with optional `bigint`", () => {
					const resultRead = passThruHandlingBigint(objectWithOptionalBigint);
					assertIdenticalTypes(resultRead, objectWithOptionalBigint);
				});
				it("array of `bigint`s", () => {
					const resultRead = passThruHandlingBigint(arrayOfBigints);
					assertIdenticalTypes(resultRead, arrayOfBigints);
				});
				it("array of `bigint` or basic object", () => {
					const resultRead = passThruHandlingBigint(arrayOfBigintOrObjects);
					assertIdenticalTypes(resultRead, arrayOfBigintOrObjects);
				});
				it("opaque serializable object with `bigint`", () => {
					const resultRead = passThruHandlingBigint(
						opaqueSerializableObjectRequiringBigintSupport,
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<OpaqueJsonDeserialized<{ bigint: bigint }, [bigint]>>(),
					);
				});
				it("opaque deserialized object with `bigint`", () => {
					const resultRead = passThruHandlingBigint(
						opaqueDeserializedObjectRequiringBigintSupport,
					);
					assertIdenticalTypes(resultRead, opaqueDeserializedObjectRequiringBigintSupport);
				});
				it("opaque serializable and deserialized object with `bigint`", () => {
					const resultRead = passThruHandlingBigint(
						opaqueSerializableAndDeserializedObjectRequiringBigintSupport,
					);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<OpaqueJsonDeserialized<{ bigint: bigint }, [bigint]>>(),
					);
				});
				it("object with specific function", () => {
					const objectWithSpecificFunction = {
						genericFn: () => undefined as unknown,
						specificFn: (v: string) => v.length,
						specificFnOrAnother: ((v: string) => v.length) as
							| ((v: string) => number)
							| ((n: number) => string),
						specificFnWithExtraProperties: Object.assign((v: string) => v.length, {
							number: 4,
							otherFn: () => undefined as unknown,
						}),
						lessRequirementsFn: () => 0 as number,
						moreSpecificOutputFn: (_v: string) => 0 as const,
						nestedWithNumberAndGenericFn: { number: 4, otherFn: () => undefined as unknown },
					};
					const resultRead = passThruHandlingSpecificFunction(objectWithSpecificFunction);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<{
							specificFn: (_: string) => number;
							specificFnOrAnother?: (_: string) => number;
							specificFnWithExtraProperties?: {
								number: number;
							};
							nestedWithNumberAndGenericFn: { number: number };
						}>(),
					);
				});
				it("`IFluidHandle`", () => {
					const resultRead = passThruHandlingFluidHandle(fluidHandleToNumber);
					assertIdenticalTypes(resultRead, createInstanceOf<IFluidHandle<number>>());
				});
				it("object with `IFluidHandle`", () => {
					const resultRead = passThruHandlingFluidHandle(objectWithFluidHandle);
					assertIdenticalTypes(resultRead, objectWithFluidHandle);
				});
				it("object with `IFluidHandle` and recursion", () => {
					const resultRead = passThruHandlingFluidHandle(objectWithFluidHandleOrRecursion);
					assertIdenticalTypes(resultRead, objectWithFluidHandleOrRecursion);
				});
				it("`unknown`", () => {
					const resultRead = passThruPreservingUnknown(
						unknownValueOfSimpleRecord,
						// value is actually supported; so, no runtime error.
					);
					assertIdenticalTypes(resultRead, unknownValueOfSimpleRecord);
				});
				it("object with optional `unknown`", () => {
					const resultRead = passThruPreservingUnknown(objectWithOptionalUnknown);
					assertIdenticalTypes(resultRead, objectWithOptionalUnknown);
				});
				it("object with optional `unknown` and recursion", () => {
					const resultRead = passThruPreservingUnknown(
						objectWithOptionalUnknownInOptionalRecursion,
					);
					assertIdenticalTypes(resultRead, objectWithOptionalUnknownInOptionalRecursion);
				});
				it("`string` indexed record of `unknown`", () => {
					const resultRead = passThruPreservingUnknown(stringRecordOfUnknown);
					assertIdenticalTypes(resultRead, stringRecordOfUnknown);
				});
				it("templated record of `unknown`", () => {
					const resultRead = passThruPreservingUnknown(templatedRecordOfUnknown);
					assertIdenticalTypes(resultRead, templatedRecordOfUnknown);
				});
				it("`string` indexed record of `unknown` and known properties", () => {
					const resultRead = passThruPreservingUnknown(
						stringRecordOfUnknownWithKnownProperties,
					);
					assertIdenticalTypes(resultRead, stringRecordOfUnknownWithKnownProperties);
				});
				it("`string` indexed record of `unknown` and optional known properties", () => {
					const resultRead = passThruPreservingUnknown(
						stringRecordOfUnknownWithOptionalKnownProperties,
					);
					assertIdenticalTypes(resultRead, stringRecordOfUnknownWithOptionalKnownProperties);
				});
				it("`string` indexed record of `unknown` and optional known `unknown`", () => {
					const resultRead = passThruPreservingUnknown(
						stringRecordOfUnknownWithOptionalKnownUnknown,
					);
					assertIdenticalTypes(resultRead, stringRecordOfUnknownWithOptionalKnownUnknown);
				});
				it("`Partial<>` `string` indexed record of `unknown`", () => {
					const resultRead = passThruPreservingUnknown(partialStringRecordOfUnknown);
					assertIdenticalTypes(resultRead, partialStringRecordOfUnknown);
				});
				it("`Partial<>` `string` indexed record of `unknown` and known properties", () => {
					const resultRead = passThruPreservingUnknown(
						partialStringRecordOfUnknownWithKnownProperties,
					);
					assertIdenticalTypes(resultRead, partialStringRecordOfUnknownWithKnownProperties);
				});
				it("array of `unknown`", () => {
					const resultRead = passThruPreservingUnknown(arrayOfUnknown);
					assertIdenticalTypes(resultRead, arrayOfUnknown);
				});
				it("object with array of `unknown`", () => {
					const resultRead = passThruPreservingUnknown(objectWithArrayOfUnknown);
					assertIdenticalTypes(resultRead, objectWithArrayOfUnknown);
				});
			});

			describe("still modifies required `unknown` to become optional", () => {
				it("object with required `unknown`", () => {
					const resultRead = passThruPreservingUnknown(objectWithUnknown);
					assertIdenticalTypes(resultRead, createInstanceOf<{ unknown?: unknown }>());
				});
				it("object with required `unknown` adjacent to recursion", () => {
					const resultRead = passThruPreservingUnknown(
						objectWithUnknownAdjacentToOptionalRecursion,
					);
					assertIdenticalTypes(
						resultRead,
						objectWithOptionalUnknownAdjacentToOptionalRecursion,
					);
				});
				it("mixed record of `unknown`", () => {
					const resultRead = passThruPreservingUnknown(mixedRecordOfUnknown);
					assertIdenticalTypes(
						resultRead,
						createInstanceOf<
							Partial<Record<number | "aKey" | `bKey_${string}` | `bKey_${number}`, unknown>>
						>(),
					);
				});
				it("`string` indexed record of `unknown` and required known `unknown`", () => {
					const resultRead = passThruPreservingUnknown(stringRecordOfUnknownWithKnownUnknown);
					assertIdenticalTypes(resultRead, stringRecordOfUnknownWithOptionalKnownUnknown);
				});
			});

			describe("continues rejecting unsupported that are not alternately allowed", () => {
				it("`unknown` (simple object) becomes `JsonTypeWith<bigint>`", () => {
					const resultRead = passThruHandlingBigint(
						unknownValueOfSimpleRecord,
						// value is actually supported; so, no runtime error.
					);
					assertIdenticalTypes(resultRead, createInstanceOf<JsonTypeWith<bigint>>());
				});
				it("`unknown` (with bigint) becomes `JsonTypeWith<bigint>`", () => {
					const resultRead = passThruHandlingBigint(
						unknownValueWithBigint,
						// value is actually supported; so, no runtime error.
					);
					assertIdenticalTypes(resultRead, createInstanceOf<JsonTypeWith<bigint>>());
				});
				it("`symbol` still becomes `never`", () => {
					passThruHandlingBigintThrows(
						symbol,
						new Error("JSON.stringify returned undefined"),
					) satisfies never;
				});
				it("`object` (plain object) still becomes non-null Json object", () => {
					const resultRead = passThruHandlingBigint(
						object,
						// object's value is actually supported; so, no runtime error.
					);
					assertIdenticalTypes(resultRead, createInstanceOf<NonNullJsonObjectWith<bigint>>());
				});
			});
		});
	});
});

/* eslint-enable unicorn/no-null */
