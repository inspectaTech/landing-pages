'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

var isUndefined = (val) => val === undefined;

var isNullOrUndefined = (value) => value === null || isUndefined(value);

var isArray = (value) => Array.isArray(value);

const isObjectType = (value) => typeof value === 'object';
var isObject = (value) => !isNullOrUndefined(value) && !isArray(value) && isObjectType(value);

var isHTMLElement = (value) => isObject(value) && value.nodeType === Node.ELEMENT_NODE;

const VALIDATION_MODE = {
    onBlur: 'onBlur',
    onChange: 'onChange',
    onSubmit: 'onSubmit',
};
const VALUE = 'value';
const UNDEFINED = 'undefined';
const EVENTS = {
    BLUR: 'blur',
    CHANGE: 'change',
    INPUT: 'input',
};
const INPUT_VALIDATION_RULES = {
    max: 'max',
    min: 'min',
    maxLength: 'maxLength',
    minLength: 'minLength',
    pattern: 'pattern',
    required: 'required',
    validate: 'validate',
};
const REGEX_IS_DEEP_PROP = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const REGEX_IS_PLAIN_PROP = /^\w*$/;
const REGEX_PROP_NAME = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const REGEX_ESCAPE_CHAR = /\\(\\)?/g;

function attachEventListeners({ field, handleChange, isRadioOrCheckbox, }) {
    const { ref } = field;
    if (isHTMLElement(ref) && ref.addEventListener && handleChange) {
        ref.addEventListener(isRadioOrCheckbox ? EVENTS.CHANGE : EVENTS.INPUT, handleChange);
        ref.addEventListener(EVENTS.BLUR, handleChange);
    }
}

var isKey = (value) => !isArray(value) &&
    (REGEX_IS_PLAIN_PROP.test(value) || !REGEX_IS_DEEP_PROP.test(value));

const stringToPath = (string) => {
    const result = [];
    string.replace(REGEX_PROP_NAME, (match, number, quote, string) => {
        result.push(quote ? string.replace(REGEX_ESCAPE_CHAR, '$1') : number || match);
    });
    return result;
};
function set(object, path, value) {
    let index = -1;
    const tempPath = isKey(path) ? [path] : stringToPath(path);
    const length = tempPath.length;
    const lastIndex = length - 1;
    while (++index < length) {
        const key = tempPath[index];
        let newValue = value;
        if (index !== lastIndex) {
            const objValue = object[key];
            newValue =
                isObject(objValue) || isArray(objValue)
                    ? objValue
                    : !isNaN(tempPath[index + 1])
                        ? []
                        : {};
        }
        object[key] = newValue;
        object = object[key];
    }
    return object;
}

var transformToNestObject = (data) => Object.entries(data).reduce((previous, [key, value]) => {
    if (!isKey(key)) {
        set(previous, key, value);
        return previous;
    }
    return Object.assign(Object.assign({}, previous), { [key]: value });
}, {});

var get = (obj, path, defaultValue) => {
    const result = path
        .split(/[,[\].]+?/)
        .filter(Boolean)
        .reduce((result, key) => (isNullOrUndefined(result) ? result : result[key]), obj);
    return isUndefined(result) || result === obj
        ? obj[path] || defaultValue
        : result;
};

var focusErrorField = (fields, fieldErrors) => {
    for (const key in fields) {
        if (get(fieldErrors, key)) {
            const field = fields[key];
            if (field) {
                if (isHTMLElement(field.ref) && field.ref.focus) {
                    field.ref.focus();
                    break;
                }
                else if (field.options) {
                    field.options[0].ref.focus();
                    break;
                }
            }
        }
    }
};

var removeAllEventListeners = (ref, validateWithStateUpdate) => {
    if (isHTMLElement(ref) && ref.removeEventListener) {
        ref.removeEventListener(EVENTS.INPUT, validateWithStateUpdate);
        ref.removeEventListener(EVENTS.CHANGE, validateWithStateUpdate);
        ref.removeEventListener(EVENTS.BLUR, validateWithStateUpdate);
    }
};

var isRadioInput = (element) => !!element && element.type === 'radio';

var isCheckBoxInput = (element) => !!element && element.type === 'checkbox';

function isDetached(element) {
    if (!element) {
        return true;
    }
    if (!(element instanceof HTMLElement) ||
        element.nodeType === Node.DOCUMENT_NODE) {
        return false;
    }
    return isDetached(element.parentNode);
}

function findRemovedFieldAndRemoveListener(fields, handleChange, field, forceDelete) {
    if (!field) {
        return;
    }
    const { ref, ref: { name, type }, mutationWatcher, } = field;
    if (!type) {
        delete fields[name];
        return;
    }
    const fieldValue = fields[name];
    if ((isRadioInput(ref) || isCheckBoxInput(ref)) && fieldValue) {
        const { options } = fieldValue;
        if (isArray(options) && options.length) {
            options.forEach(({ ref, mutationWatcher }, index) => {
                if ((ref && isDetached(ref)) || forceDelete) {
                    removeAllEventListeners(ref, handleChange);
                    if (mutationWatcher) {
                        mutationWatcher.disconnect();
                    }
                    options.splice(index, 1);
                }
            });
            if (options && !options.length) {
                delete fields[name];
            }
        }
        else {
            delete fields[name];
        }
    }
    else if (isDetached(ref) || forceDelete) {
        removeAllEventListeners(ref, handleChange);
        if (mutationWatcher) {
            mutationWatcher.disconnect();
        }
        delete fields[name];
    }
}

const defaultReturn = {
    isValid: false,
    value: '',
};
var getRadioValue = (options) => isArray(options)
    ? options.reduce((previous, { ref: { checked, value } }) => checked
        ? {
            isValid: true,
            value,
        }
        : previous, defaultReturn)
    : defaultReturn;

var getMultipleSelectValue = (options) => [...options]
    .filter(({ selected }) => selected)
    .map(({ value }) => value);

var isFileInput = (element) => !!element && element.type === 'file';

var isMultipleSelect = (element) => !!element && element.type === 'select-multiple';

var isEmptyString = (value) => value === '';

const defaultResult = {
    value: false,
    isValid: false,
};
const validResult = { value: true, isValid: true };
var getCheckboxValue = (options) => {
    if (isArray(options)) {
        if (options.length > 1) {
            const values = options
                .filter(({ ref: { checked } }) => checked)
                .map(({ ref: { value } }) => value);
            return { value: values, isValid: !!values.length };
        }
        const { checked, value, attributes } = options[0].ref;
        return checked
            ? attributes && !isUndefined(attributes.value)
                ? isUndefined(value) || isEmptyString(value)
                    ? validResult
                    : { value: value, isValid: true }
                : validResult
            : defaultResult;
    }
    return defaultResult;
};

function getFieldValue(fields, ref) {
    const { name, value } = ref;
    const field = fields[name];
    if (isFileInput(ref)) {
        return ref.files;
    }
    if (isRadioInput(ref)) {
        return field ? getRadioValue(field.options).value : '';
    }
    if (isMultipleSelect(ref)) {
        return getMultipleSelectValue(ref.options);
    }
    if (isCheckBoxInput(ref)) {
        return field ? getCheckboxValue(field.options).value : false;
    }
    return value;
}

var isString = (value) => typeof value === 'string';

var getFieldsValues = (fields, search) => {
    const output = {};
    const isSearchString = isString(search);
    const isSearchArray = isArray(search);
    const isNest = search && search.nest;
    for (const name in fields) {
        if (isUndefined(search) ||
            isNest ||
            (isSearchString && name.startsWith(search)) ||
            (isSearchArray &&
                search.find((data) => name.startsWith(data)))) {
            output[name] = getFieldValue(fields, fields[name].ref);
        }
    }
    return output;
};

var isEmptyObject = (value) => isObject(value) && !Object.keys(value).length;

var compareObject = (objectA = {}, objectB = {}) => Object.entries(objectA).reduce((previous, [key, value]) => previous ? objectB[key] && objectB[key] === value : false, true);

var isSameError = (error, { type, types, message, }) => {
    return (isObject(error) &&
        error.type === type &&
        error.message === message &&
        compareObject(error.types, types));
};

function shouldUpdateWithError({ errors, name, error, validFields, fieldsWithValidation, }) {
    const isFieldValid = isEmptyObject(error);
    const isFormValid = isEmptyObject(errors);
    const currentFieldError = get(error, name);
    const existFieldError = get(errors, name);
    if ((isFieldValid && validFields.has(name)) ||
        (existFieldError && existFieldError.isManual)) {
        return false;
    }
    if (isFormValid !== isFieldValid ||
        (!isFormValid && !existFieldError) ||
        (isFieldValid && fieldsWithValidation.has(name) && !validFields.has(name))) {
        return true;
    }
    return currentFieldError && !isSameError(existFieldError, currentFieldError);
}

var isRegex = (value) => value instanceof RegExp;

var getValueAndMessage = (validationData) => {
    const isPureObject = isObject(validationData) && !isRegex(validationData);
    return {
        value: isPureObject
            ? validationData.value
            : validationData,
        message: isPureObject
            ? validationData.message
            : '',
    };
};

var isFunction = (value) => typeof value === 'function';

var isBoolean = (value) => typeof value === 'boolean';

function getValidateError(result, ref, type = 'validate') {
    const isStringValue = isString(result);
    if (isStringValue || (isBoolean(result) && !result)) {
        const message = isStringValue ? result : '';
        return {
            type,
            message,
            ref,
        };
    }
}

var appendErrors = (name, validateAllFieldCriteria, errors, type, message) => {
    if (!validateAllFieldCriteria) {
        return {};
    }
    const error = errors[name];
    return Object.assign(Object.assign({}, error), { types: Object.assign(Object.assign({}, (error && error.types ? error.types : {})), { [type]: message || true }) });
};

var validateField = async (fieldsRef, validateAllFieldCriteria, { ref, ref: { type, value, name }, options, required, maxLength, minLength, min, max, pattern, validate, }) => {
    const fields = fieldsRef.current;
    const error = {};
    const isRadio = isRadioInput(ref);
    const isCheckBox = isCheckBoxInput(ref);
    const isRadioOrCheckbox = isRadio || isCheckBox;
    const isEmpty = isEmptyString(value);
    const appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
    const getMinMaxMessage = (exceedMax, maxLengthMessage, minLengthMessage, maxType = INPUT_VALIDATION_RULES.maxLength, minType = INPUT_VALIDATION_RULES.minLength) => {
        const message = exceedMax ? maxLengthMessage : minLengthMessage;
        error[name] = Object.assign({ type: exceedMax ? maxType : minType, message,
            ref }, (exceedMax
            ? appendErrorsCurry(maxType, message)
            : appendErrorsCurry(minType, message)));
        if (!validateAllFieldCriteria) {
            return error;
        }
    };
    if (required &&
        ((!isRadio && !isCheckBox && (isEmpty || isNullOrUndefined(value))) ||
            (isBoolean(value) && !value) ||
            (isCheckBox && !getCheckboxValue(options).isValid) ||
            (isRadio && !getRadioValue(options).isValid))) {
        const { value: requiredValue, message: requiredMessage } = isString(required)
            ? { value: !!required, message: required }
            : getValueAndMessage(required);
        if (requiredValue) {
            error[name] = Object.assign({ type: INPUT_VALIDATION_RULES.required, message: requiredMessage, ref: isRadioOrCheckbox ? fields[name].options[0].ref : ref }, appendErrorsCurry(INPUT_VALIDATION_RULES.required, requiredMessage));
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if (!isNullOrUndefined(min) || !isNullOrUndefined(max)) {
        let exceedMax;
        let exceedMin;
        const { value: maxValue, message: maxMessage } = getValueAndMessage(max);
        const { value: minValue, message: minMessage } = getValueAndMessage(min);
        if (type === 'number' || (!type && !isNaN(value))) {
            const valueNumber = ref.valueAsNumber || parseFloat(value);
            if (!isNullOrUndefined(maxValue)) {
                exceedMax = valueNumber > maxValue;
            }
            if (!isNullOrUndefined(minValue)) {
                exceedMin = valueNumber < minValue;
            }
        }
        else {
            const valueDate = ref.valueAsDate || new Date(value);
            if (isString(maxValue)) {
                exceedMax = valueDate > new Date(maxValue);
            }
            if (isString(minValue)) {
                exceedMin = valueDate < new Date(minValue);
            }
        }
        if (exceedMax || exceedMin) {
            getMinMaxMessage(!!exceedMax, maxMessage, minMessage, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if (isString(value) && !isEmpty && (maxLength || minLength)) {
        const { value: maxLengthValue, message: maxLengthMessage, } = getValueAndMessage(maxLength);
        const { value: minLengthValue, message: minLengthMessage, } = getValueAndMessage(minLength);
        const inputLength = value.toString().length;
        const exceedMax = maxLength && inputLength > maxLengthValue;
        const exceedMin = minLength && inputLength < minLengthValue;
        if (exceedMax || exceedMin) {
            getMinMaxMessage(!!exceedMax, maxLengthMessage, minLengthMessage);
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if (pattern && !isEmpty) {
        const { value: patternValue, message: patternMessage } = getValueAndMessage(pattern);
        if (isRegex(patternValue) && !patternValue.test(value)) {
            error[name] = Object.assign({ type: INPUT_VALIDATION_RULES.pattern, message: patternMessage, ref }, appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, patternMessage));
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if (validate) {
        const fieldValue = getFieldValue(fields, ref);
        const validateRef = isRadioOrCheckbox && options ? options[0].ref : ref;
        if (isFunction(validate)) {
            const result = await validate(fieldValue);
            const validateError = getValidateError(result, validateRef);
            if (validateError) {
                error[name] = Object.assign(Object.assign({}, validateError), appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message));
                if (!validateAllFieldCriteria) {
                    return error;
                }
            }
        }
        else if (isObject(validate)) {
            const validateFunctions = Object.entries(validate);
            const validationResult = await new Promise((resolve) => {
                validateFunctions.reduce(async (previous, [key, validate], index) => {
                    if ((!isEmptyObject(await previous) && !validateAllFieldCriteria) ||
                        !isFunction(validate)) {
                        return resolve(previous);
                    }
                    let result;
                    const validateResult = await validate(fieldValue);
                    const validateError = getValidateError(validateResult, validateRef, key);
                    if (validateError) {
                        result = Object.assign(Object.assign({}, validateError), appendErrorsCurry(key, validateError.message));
                        if (validateAllFieldCriteria) {
                            error[name] = result;
                        }
                    }
                    else {
                        result = previous;
                    }
                    return validateFunctions.length - 1 === index
                        ? resolve(result)
                        : result;
                }, {});
            });
            if (!isEmptyObject(validationResult)) {
                error[name] = Object.assign({ ref: validateRef }, validationResult);
                if (!validateAllFieldCriteria) {
                    return error;
                }
            }
        }
    }
    return error;
};

const parseErrorSchema = (error, validateAllFieldCriteria) => isArray(error.inner)
    ? error.inner.reduce((previous, { path, message, type }) => (Object.assign(Object.assign({}, previous), (previous[path] && validateAllFieldCriteria
        ? {
            [path]: appendErrors(path, validateAllFieldCriteria, previous, type, message),
        }
        : {
            [path]: previous[path] || Object.assign({ message,
                type }, (validateAllFieldCriteria
                ? {
                    types: { [type]: message || true },
                }
                : {})),
        }))), {})
    : {
        [error.path]: { message: error.message, type: error.type },
    };
async function validateWithSchema(validationSchema, validateAllFieldCriteria, data, validationResolver, context) {
    if (validationResolver) {
        return validationResolver(data, context);
    }
    try {
        return {
            values: await validationSchema.validate(data, {
                abortEarly: false,
                context,
            }),
            errors: {},
        };
    }
    catch (e) {
        return {
            values: {},
            errors: transformToNestObject(parseErrorSchema(e, validateAllFieldCriteria)),
        };
    }
}

var getDefaultValue = (defaultValues, name, defaultValue) => isUndefined(defaultValues[name])
    ? get(defaultValues, name, defaultValue)
    : defaultValues[name];

function flatArray(list) {
    return list.reduce((a, b) => a.concat(isArray(b) ? flatArray(b) : b), []);
}

var isPrimitive = (value) => isNullOrUndefined(value) || !isObjectType(value);

const getPath = (path, values) => {
    const getInnerPath = (value, key, isObject) => {
        const pathWithIndex = isObject ? `${path}.${key}` : `${path}[${key}]`;
        return isPrimitive(value) ? pathWithIndex : getPath(pathWithIndex, value);
    };
    return isArray(values)
        ? values.map((value, key) => getInnerPath(value, key))
        : Object.entries(values).map(([key, value]) => getInnerPath(value, key, true));
};
var getPath$1 = (parentPath, value) => flatArray(getPath(parentPath, value));

var assignWatchFields = (fieldValues, fieldName, watchFields, combinedDefaultValues, watchFieldArray) => {
    let value;
    watchFields.add(fieldName);
    if (isEmptyObject(fieldValues)) {
        value = watchFieldArray ? watchFieldArray : undefined;
    }
    else if (!isUndefined(fieldValues[fieldName])) {
        value = fieldValues[fieldName];
        watchFields.add(fieldName);
    }
    else {
        value = get(transformToNestObject(fieldValues), fieldName);
        if (isArray(watchFieldArray) &&
            isArray(value) &&
            value.length !== watchFieldArray.length) {
            value = watchFieldArray;
        }
        if (!isUndefined(value)) {
            getPath$1(fieldName, value).forEach(name => watchFields.add(name));
        }
    }
    return isUndefined(value)
        ? isObject(combinedDefaultValues)
            ? getDefaultValue(combinedDefaultValues, fieldName)
            : combinedDefaultValues
        : value;
};

var skipValidation = ({ hasError, isBlurEvent, isOnSubmit, isReValidateOnSubmit, isOnBlur, isReValidateOnBlur, isSubmitted, }) => (isOnSubmit && isReValidateOnSubmit) ||
    (isOnSubmit && !isSubmitted) ||
    (isOnBlur && !isBlurEvent && !hasError) ||
    (isReValidateOnBlur && !isBlurEvent && hasError) ||
    (isReValidateOnSubmit && isSubmitted);

var getFieldValueByName = (fields, name) => {
    const results = transformToNestObject(getFieldsValues(fields));
    return name ? get(results, name, results) : results;
};

function getIsFieldsDifferent(referenceArray, differenceArray) {
    let isMatch = false;
    if (!isArray(referenceArray) ||
        !isArray(differenceArray) ||
        referenceArray.length !== differenceArray.length) {
        return true;
    }
    for (let i = 0; i < referenceArray.length; i++) {
        if (isMatch) {
            break;
        }
        const dataA = referenceArray[i];
        const dataB = differenceArray[i];
        if (isUndefined(dataB) ||
            Object.keys(dataA).length !== Object.keys(dataB).length) {
            isMatch = true;
            break;
        }
        for (const key in dataA) {
            if (dataA[key] !== dataB[key]) {
                isMatch = true;
                break;
            }
        }
    }
    return isMatch;
}

const isMatchFieldArrayName = (name, searchName) => name.startsWith(`${searchName}[`);
var isNameInFieldArray = (names, name) => [...names].reduce((prev, current) => (isMatchFieldArrayName(name, current) ? true : prev), false);

var isFileListObject = (data) => typeof FileList !== UNDEFINED && data instanceof FileList;

function onDomRemove(element, onDetachCallback) {
    const observer = new MutationObserver(() => {
        if (isDetached(element)) {
            observer.disconnect();
            onDetachCallback();
        }
    });
    observer.observe(window.document, {
        childList: true,
        subtree: true,
    });
    return observer;
}

function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
}
function baseGet(object, path) {
    const updatePath = isKey(path) ? [path] : castPath(path);
    const length = path.length;
    let index = 0;
    while (index < length) {
        object = isUndefined(object) ? index++ : object[updatePath[index++]];
    }
    return index == length ? object : undefined;
}
function baseSlice(array, start, end) {
    let index = -1;
    let length = array.length;
    if (start < 0) {
        start = -start > length ? 0 : length + start;
    }
    end = end > length ? length : end;
    if (end < 0) {
        end += length;
    }
    length = start > end ? 0 : end - start;
    const result = Array(length);
    while (++index < length) {
        result[index] = array[index + start];
    }
    return result;
}
function parent(object, path) {
    return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
}
function baseUnset(object, path) {
    const updatePath = isKey(path) ? [path] : castPath(path);
    object = parent(object, updatePath);
    const key = updatePath[updatePath.length - 1];
    return !(object != null) || delete object[key];
}
function unset(object, paths) {
    paths.forEach(path => {
        baseUnset(object, path);
    });
    return object;
}

var modeChecker = (mode) => ({
    isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
    isOnBlur: mode === VALIDATION_MODE.onBlur,
    isOnChange: mode === VALIDATION_MODE.onChange,
});

const { useRef, useState, useCallback, useEffect } = React;
function useForm({ mode = VALIDATION_MODE.onSubmit, reValidateMode = VALIDATION_MODE.onChange, validationSchema, validationResolver, validationContext, defaultValues = {}, submitFocusError = true, validateCriteriaMode, } = {}) {
    const fieldsRef = useRef({});
    const validateAllFieldCriteria = validateCriteriaMode === 'all';
    const errorsRef = useRef({});
    const touchedFieldsRef = useRef({});
    const watchFieldArrayRef = useRef({});
    const watchFieldsRef = useRef(new Set());
    const dirtyFieldsRef = useRef(new Set());
    const fieldsWithValidationRef = useRef(new Set());
    const validFieldsRef = useRef(new Set());
    const isValidRef = useRef(true);
    const defaultRenderValuesRef = useRef({});
    const defaultValuesRef = useRef(defaultValues);
    const isUnMount = useRef(false);
    const isWatchAllRef = useRef(false);
    const isSubmittedRef = useRef(false);
    const isDirtyRef = useRef(false);
    const submitCountRef = useRef(0);
    const isSubmittingRef = useRef(false);
    const handleChangeRef = useRef();
    const resetFieldArrayFunctionRef = useRef({});
    const fieldArrayNamesRef = useRef(new Set());
    const [, render] = useState();
    const { isOnBlur, isOnSubmit } = useRef(modeChecker(mode)).current;
    const isWindowUndefined = typeof window === UNDEFINED;
    const shouldValidateCallback = !!(validationSchema || validationResolver);
    const isWeb = typeof document !== UNDEFINED &&
        !isWindowUndefined &&
        !isUndefined(window.HTMLElement);
    const isProxyEnabled = isWeb && 'Proxy' in window;
    const readFormStateRef = useRef({
        dirty: !isProxyEnabled,
        dirtyFields: !isProxyEnabled,
        isSubmitted: isOnSubmit,
        submitCount: !isProxyEnabled,
        touched: !isProxyEnabled,
        isSubmitting: !isProxyEnabled,
        isValid: !isProxyEnabled,
    });
    const { isOnBlur: isReValidateOnBlur, isOnSubmit: isReValidateOnSubmit, } = useRef(modeChecker(reValidateMode)).current;
    const reRender = useCallback(() => {
        if (!isUnMount.current) {
            render({});
        }
    }, []);
    const shouldRenderBaseOnError = useCallback((name, error, shouldRender, skipReRender) => {
        let shouldReRender = shouldRender ||
            shouldUpdateWithError({
                errors: errorsRef.current,
                error,
                name,
                validFields: validFieldsRef.current,
                fieldsWithValidation: fieldsWithValidationRef.current,
            });
        if (isEmptyObject(error)) {
            if (fieldsWithValidationRef.current.has(name) ||
                shouldValidateCallback) {
                validFieldsRef.current.add(name);
                shouldReRender = shouldReRender || get(errorsRef.current, name);
            }
            errorsRef.current = unset(errorsRef.current, [name]);
        }
        else {
            validFieldsRef.current.delete(name);
            shouldReRender = shouldReRender || !get(errorsRef.current, name);
            set(errorsRef.current, name, error[name]);
        }
        if (shouldReRender && !skipReRender) {
            reRender();
            return true;
        }
    }, [reRender, shouldValidateCallback]);
    const setFieldValue = useCallback((name, rawValue) => {
        const field = fieldsRef.current[name];
        if (!field) {
            return false;
        }
        const ref = field.ref;
        const options = field.options;
        const { type } = ref;
        const value = isWeb && isHTMLElement(ref) && isNullOrUndefined(rawValue)
            ? ''
            : rawValue;
        if (isRadioInput(ref) && options) {
            options.forEach(({ ref: radioRef }) => (radioRef.checked = radioRef.value === value));
        }
        else if (isFileInput(ref)) {
            if (isEmptyString(value) ||
                isFileListObject(value)) {
                ref.files = value;
            }
            else {
                ref.value = value;
            }
        }
        else if (isMultipleSelect(ref)) {
            [...ref.options].forEach(selectRef => (selectRef.selected = value.includes(selectRef.value)));
        }
        else if (isCheckBoxInput(ref) && options) {
            options.length > 1
                ? options.forEach(({ ref: checkboxRef }) => (checkboxRef.checked = value.includes(checkboxRef.value)))
                : (options[0].ref.checked = !!value);
        }
        else {
            ref.value = value;
        }
        return !!type;
    }, [isWeb]);
    const setDirty = (name) => {
        if (!fieldsRef.current[name] ||
            (!readFormStateRef.current.dirty && !readFormStateRef.current.dirtyFields)) {
            return false;
        }
        const isFieldArray = isNameInFieldArray(fieldArrayNamesRef.current, name);
        const previousDirtyFieldsLength = dirtyFieldsRef.current.size;
        let isDirty = defaultRenderValuesRef.current[name] !==
            getFieldValue(fieldsRef.current, fieldsRef.current[name].ref);
        if (isFieldArray) {
            const fieldArrayName = name.substring(0, name.indexOf('['));
            isDirty = getIsFieldsDifferent(getFieldValueByName(fieldsRef.current, fieldArrayName), get(defaultValuesRef.current, fieldArrayName));
        }
        const isDirtyChanged = (isFieldArray ? isDirtyRef.current : dirtyFieldsRef.current.has(name)) !==
            isDirty;
        if (isDirty) {
            dirtyFieldsRef.current.add(name);
        }
        else {
            dirtyFieldsRef.current.delete(name);
        }
        isDirtyRef.current = isFieldArray ? isDirty : !!dirtyFieldsRef.current.size;
        return readFormStateRef.current.dirty
            ? isDirtyChanged
            : previousDirtyFieldsLength !== dirtyFieldsRef.current.size;
    };
    const setInternalValue = useCallback((name, value) => {
        setFieldValue(name, value);
        if (setDirty(name) ||
            (!get(touchedFieldsRef.current, name) &&
                readFormStateRef.current.touched)) {
            return !!set(touchedFieldsRef.current, name, true);
        }
    }, [setFieldValue]);
    const executeValidation = useCallback(async (name, skipReRender) => {
        const field = fieldsRef.current[name];
        if (!field) {
            return false;
        }
        const error = await validateField(fieldsRef, validateAllFieldCriteria, field);
        shouldRenderBaseOnError(name, error, false, skipReRender);
        return isEmptyObject(error);
    }, [shouldRenderBaseOnError, validateAllFieldCriteria]);
    const executeSchemaValidation = useCallback(async (payload) => {
        const { errors } = await validateWithSchema(validationSchema, validateAllFieldCriteria, getFieldValueByName(fieldsRef.current), validationResolver, validationContext);
        const previousFormIsValid = isValidRef.current;
        isValidRef.current = isEmptyObject(errors);
        if (isArray(payload)) {
            payload.forEach(name => {
                const error = get(errors, name);
                if (error) {
                    set(errorsRef.current, name, error);
                }
                else {
                    unset(errorsRef.current, [name]);
                }
            });
            reRender();
        }
        else {
            shouldRenderBaseOnError(payload, (get(errors, payload)
                ? { [payload]: get(errors, payload) }
                : {}), previousFormIsValid !== isValidRef.current);
        }
        return isEmptyObject(errorsRef.current);
    }, [
        reRender,
        shouldRenderBaseOnError,
        validateAllFieldCriteria,
        validationContext,
        validationResolver,
        validationSchema,
    ]);
    const triggerValidation = useCallback(async (payload) => {
        const fields = payload || Object.keys(fieldsRef.current);
        if (shouldValidateCallback) {
            return executeSchemaValidation(fields);
        }
        if (isArray(fields)) {
            const result = await Promise.all(fields.map(async (data) => await executeValidation(data, true)));
            reRender();
            return result.every(Boolean);
        }
        return await executeValidation(fields);
    }, [
        executeSchemaValidation,
        executeValidation,
        reRender,
        shouldValidateCallback,
    ]);
    const isFieldWatched = (name) => {
        const preFixName = (name.match(/\w+/) || [])[0];
        return (isWatchAllRef.current ||
            watchFieldsRef.current.has(name) ||
            (watchFieldsRef.current.has(preFixName) &&
                !isKey(name) &&
                fieldArrayNamesRef.current.has(preFixName)));
    };
    const setValue = useCallback((name, value, shouldValidate) => {
        const shouldRender = setInternalValue(name, value) || isFieldWatched(name);
        if (shouldRender) {
            reRender();
        }
        if (shouldValidate) {
            triggerValidation(name);
        }
        return;
    }, [reRender, setInternalValue, triggerValidation]);
    handleChangeRef.current = handleChangeRef.current
        ? handleChangeRef.current
        : async ({ type, target }) => {
            const name = target ? target.name : '';
            const fields = fieldsRef.current;
            const errors = errorsRef.current;
            const field = fields[name];
            const currentError = get(errors, name);
            let error;
            if (!field) {
                return;
            }
            const isBlurEvent = type === EVENTS.BLUR;
            const shouldSkipValidation = skipValidation({
                hasError: !!currentError,
                isBlurEvent,
                isOnSubmit,
                isReValidateOnSubmit,
                isOnBlur,
                isReValidateOnBlur,
                isSubmitted: isSubmittedRef.current,
            });
            const shouldUpdateDirty = setDirty(name);
            let shouldUpdateState = isFieldWatched(name) || shouldUpdateDirty;
            if (isBlurEvent &&
                !get(touchedFieldsRef.current, name) &&
                readFormStateRef.current.touched) {
                set(touchedFieldsRef.current, name, true);
                shouldUpdateState = true;
            }
            if (shouldSkipValidation) {
                return shouldUpdateState && reRender();
            }
            if (shouldValidateCallback) {
                const { errors } = await validateWithSchema(validationSchema, validateAllFieldCriteria, getFieldValueByName(fields), validationResolver, validationContext);
                const previousFormIsValid = isValidRef.current;
                isValidRef.current = isEmptyObject(errors);
                error = (get(errors, name)
                    ? { [name]: get(errors, name) }
                    : {});
                if (previousFormIsValid !== isValidRef.current) {
                    shouldUpdateState = true;
                }
            }
            else {
                error = await validateField(fieldsRef, validateAllFieldCriteria, field);
            }
            if (!shouldRenderBaseOnError(name, error) && shouldUpdateState) {
                reRender();
            }
        };
    const validateSchemaIsValid = useCallback((values = {}) => {
        const fieldValues = isEmptyObject(defaultValuesRef.current)
            ? getFieldsValues(fieldsRef.current)
            : defaultValuesRef.current;
        validateWithSchema(validationSchema, validateAllFieldCriteria, transformToNestObject(Object.assign(Object.assign({}, fieldValues), values)), validationResolver, validationContext).then(({ errors }) => {
            const previousFormIsValid = isValidRef.current;
            isValidRef.current = isEmptyObject(errors);
            if (previousFormIsValid !== isValidRef.current) {
                reRender();
            }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reRender, validateAllFieldCriteria, validationContext, validationResolver]);
    const removeFieldEventListener = (field, forceDelete) => {
        if (!isUndefined(handleChangeRef.current) && field) {
            findRemovedFieldAndRemoveListener(fieldsRef.current, handleChangeRef.current, field, forceDelete);
        }
    };
    const removeFieldEventListenerAndRef = useCallback((field, forceDelete) => {
        if (!field ||
            (field &&
                isNameInFieldArray(fieldArrayNamesRef.current, field.ref.name) &&
                !forceDelete)) {
            return;
        }
        removeFieldEventListener(field, forceDelete);
        const { name } = field.ref;
        errorsRef.current = unset(errorsRef.current, [name]);
        touchedFieldsRef.current = unset(touchedFieldsRef.current, [name]);
        defaultRenderValuesRef.current = unset(defaultRenderValuesRef.current, [
            name,
        ]);
        [
            dirtyFieldsRef,
            fieldsWithValidationRef,
            validFieldsRef,
            watchFieldsRef,
        ].forEach(data => data.current.delete(name));
        if (readFormStateRef.current.isValid ||
            readFormStateRef.current.touched) {
            reRender();
            if (shouldValidateCallback) {
                validateSchemaIsValid();
            }
        }
    }, [reRender, shouldValidateCallback, validateSchemaIsValid]);
    function clearError(name) {
        if (isUndefined(name)) {
            errorsRef.current = {};
        }
        else {
            unset(errorsRef.current, isArray(name) ? name : [name]);
        }
        reRender();
    }
    const setInternalError = ({ name, type, types, message, preventRender, }) => {
        const field = fieldsRef.current[name];
        if (!isSameError(errorsRef.current[name], {
            type,
            message,
            types,
        })) {
            set(errorsRef.current, name, {
                type,
                types,
                message,
                ref: field ? field.ref : {},
                isManual: true,
            });
            if (!preventRender) {
                reRender();
            }
        }
    };
    function setError(name, type = '', message) {
        if (isString(name)) {
            setInternalError(Object.assign({ name }, (isObject(type)
                ? {
                    types: type,
                    type: '',
                }
                : {
                    type,
                    message,
                })));
        }
        else if (isArray(name)) {
            name.forEach(error => setInternalError(Object.assign(Object.assign({}, error), { preventRender: true })));
            reRender();
        }
    }
    function watch(fieldNames, defaultValue) {
        const combinedDefaultValues = isUndefined(defaultValue)
            ? isUndefined(defaultValuesRef.current)
                ? {}
                : defaultValuesRef.current
            : defaultValue;
        const fieldValues = getFieldsValues(fieldsRef.current, fieldNames);
        const watchFields = watchFieldsRef.current;
        if (isProxyEnabled) {
            readFormStateRef.current.dirty = true;
        }
        if (isString(fieldNames)) {
            return assignWatchFields(fieldValues, fieldNames, watchFields, combinedDefaultValues, fieldArrayNamesRef.current.has(fieldNames)
                ? watchFieldArrayRef.current[fieldNames]
                : undefined);
        }
        if (isArray(fieldNames)) {
            return fieldNames.reduce((previous, name) => {
                let value;
                if (isEmptyObject(fieldsRef.current) &&
                    isObject(combinedDefaultValues)) {
                    value = getDefaultValue(combinedDefaultValues, name);
                }
                else {
                    value = assignWatchFields(fieldValues, name, watchFields, combinedDefaultValues);
                }
                return Object.assign(Object.assign({}, previous), { [name]: value });
            }, {});
        }
        isWatchAllRef.current = true;
        const result = (!isEmptyObject(fieldValues) && fieldValues) ||
            defaultValue ||
            defaultValuesRef.current;
        return fieldNames && fieldNames.nest
            ? transformToNestObject(result)
            : result;
    }
    function unregister(names) {
        if (!isEmptyObject(fieldsRef.current)) {
            (isArray(names) ? names : [names]).forEach(fieldName => removeFieldEventListenerAndRef(fieldsRef.current[fieldName], true));
        }
    }
    function registerFieldsRef(ref, validateOptions = {}) {
        if (!ref.name) {
            // eslint-disable-next-line no-console
            return console.warn('Missing name @', ref);
        }
        const { name, type, value } = ref;
        const fieldAttributes = Object.assign({ ref }, validateOptions);
        const fields = fieldsRef.current;
        const isRadioOrCheckbox = isRadioInput(ref) || isCheckBoxInput(ref);
        let currentField = fields[name];
        let isEmptyDefaultValue = true;
        let isFieldArray = false;
        let defaultValue;
        if (isRadioOrCheckbox
            ? currentField &&
                isArray(currentField.options) &&
                currentField.options.find(({ ref }) => value === ref.value)
            : currentField) {
            fields[name] = Object.assign(Object.assign({}, currentField), validateOptions);
            return;
        }
        if (type) {
            const mutationWatcher = onDomRemove(ref, () => removeFieldEventListenerAndRef(fieldAttributes));
            currentField = isRadioOrCheckbox
                ? Object.assign({ options: [
                        ...((currentField && currentField.options) || []),
                        {
                            ref,
                            mutationWatcher,
                        },
                    ], ref: { type, name } }, validateOptions) : Object.assign(Object.assign({}, fieldAttributes), { mutationWatcher });
        }
        else {
            currentField = fieldAttributes;
        }
        fields[name] = currentField;
        if (!isEmptyObject(defaultValuesRef.current)) {
            defaultValue = getDefaultValue(defaultValuesRef.current, name);
            isEmptyDefaultValue = isUndefined(defaultValue);
            isFieldArray = isNameInFieldArray(fieldArrayNamesRef.current, name);
            if (!isEmptyDefaultValue && !isFieldArray) {
                setFieldValue(name, defaultValue);
            }
        }
        if (shouldValidateCallback &&
            !isFieldArray &&
            readFormStateRef.current.isValid) {
            validateSchemaIsValid();
        }
        else if (!isEmptyObject(validateOptions)) {
            fieldsWithValidationRef.current.add(name);
            if (!isOnSubmit && readFormStateRef.current.isValid) {
                validateField(fieldsRef, validateAllFieldCriteria, currentField).then(error => {
                    const previousFormIsValid = isValidRef.current;
                    if (isEmptyObject(error)) {
                        validFieldsRef.current.add(name);
                    }
                    else {
                        isValidRef.current = false;
                    }
                    if (previousFormIsValid !== isValidRef.current) {
                        reRender();
                    }
                });
            }
        }
        if (!defaultRenderValuesRef.current[name] &&
            !(isFieldArray && isEmptyDefaultValue)) {
            defaultRenderValuesRef.current[name] = isEmptyDefaultValue
                ? getFieldValue(fields, currentField.ref)
                : defaultValue;
        }
        if (!type) {
            return;
        }
        const fieldToAttachListener = isRadioOrCheckbox && currentField.options
            ? currentField.options[currentField.options.length - 1]
            : currentField;
        attachEventListeners({
            field: fieldToAttachListener,
            isRadioOrCheckbox,
            handleChange: handleChangeRef.current,
        });
    }
    function register(refOrValidationOptions, validationOptions) {
        if (isWindowUndefined) {
            return;
        }
        if (isString(refOrValidationOptions)) {
            registerFieldsRef({ name: refOrValidationOptions }, validationOptions);
            return;
        }
        if (isObject(refOrValidationOptions) && 'name' in refOrValidationOptions) {
            registerFieldsRef(refOrValidationOptions, validationOptions);
            return;
        }
        return (ref) => ref && registerFieldsRef(ref, refOrValidationOptions);
    }
    const handleSubmit = useCallback((callback) => async (e) => {
        if (e) {
            e.preventDefault();
            e.persist();
        }
        let fieldErrors;
        let fieldValues;
        const fields = fieldsRef.current;
        if (readFormStateRef.current.isSubmitting) {
            isSubmittingRef.current = true;
            reRender();
        }
        try {
            if (shouldValidateCallback) {
                fieldValues = getFieldsValues(fields);
                const { errors, values } = await validateWithSchema(validationSchema, validateAllFieldCriteria, transformToNestObject(fieldValues), validationResolver, validationContext);
                errorsRef.current = errors;
                fieldErrors = errors;
                fieldValues = values;
            }
            else {
                const { errors, values, } = await Object.values(fields).reduce(async (previous, field) => {
                    if (!field) {
                        return previous;
                    }
                    const resolvedPrevious = await previous;
                    const { ref, ref: { name }, } = field;
                    if (!fields[name]) {
                        return Promise.resolve(resolvedPrevious);
                    }
                    const fieldError = await validateField(fieldsRef, validateAllFieldCriteria, field);
                    if (fieldError[name]) {
                        set(resolvedPrevious.errors, name, fieldError[name]);
                        validFieldsRef.current.delete(name);
                        return Promise.resolve(resolvedPrevious);
                    }
                    if (fieldsWithValidationRef.current.has(name)) {
                        validFieldsRef.current.add(name);
                    }
                    resolvedPrevious.values[name] = getFieldValue(fields, ref);
                    return Promise.resolve(resolvedPrevious);
                }, Promise.resolve({
                    errors: {},
                    values: {},
                }));
                fieldErrors = errors;
                fieldValues = values;
            }
            if (isEmptyObject(fieldErrors)) {
                errorsRef.current = {};
                await callback(transformToNestObject(fieldValues), e);
            }
            else {
                if (submitFocusError && isWeb) {
                    focusErrorField(fields, fieldErrors);
                }
                errorsRef.current = fieldErrors;
            }
        }
        finally {
            isSubmittedRef.current = true;
            isSubmittingRef.current = false;
            submitCountRef.current = submitCountRef.current + 1;
            reRender();
        }
    }, [
        isWeb,
        reRender,
        shouldValidateCallback,
        submitFocusError,
        validateAllFieldCriteria,
        validationContext,
        validationResolver,
        validationSchema,
    ]);
    const resetRefs = () => {
        errorsRef.current = {};
        fieldsRef.current = {};
        touchedFieldsRef.current = {};
        validFieldsRef.current = new Set();
        fieldsWithValidationRef.current = new Set();
        defaultRenderValuesRef.current = {};
        watchFieldsRef.current = new Set();
        dirtyFieldsRef.current = new Set();
        isWatchAllRef.current = false;
        isSubmittedRef.current = false;
        isDirtyRef.current = false;
        isValidRef.current = true;
        submitCountRef.current = 0;
    };
    const reset = (values) => {
        if (isWeb) {
            for (const value of Object.values(fieldsRef.current)) {
                if (value && isHTMLElement(value.ref) && value.ref.closest) {
                    try {
                        value.ref.closest('form').reset();
                        break;
                    }
                    catch (_a) { }
                }
            }
        }
        if (values) {
            defaultValuesRef.current = values;
        }
        Object.values(resetFieldArrayFunctionRef.current).forEach(resetFieldArray => isFunction(resetFieldArray) && resetFieldArray());
        resetRefs();
        reRender();
    };
    const getValues = (payload) => {
        const fieldValues = getFieldsValues(fieldsRef.current);
        return payload && payload.nest
            ? transformToNestObject(fieldValues)
            : fieldValues;
    };
    useEffect(() => () => {
        isUnMount.current = true;
        fieldsRef.current &&
            Object.values(fieldsRef.current).forEach((field) => removeFieldEventListenerAndRef(field, true));
    }, [removeFieldEventListenerAndRef]);
    if (!shouldValidateCallback) {
        isValidRef.current =
            validFieldsRef.current.size >= fieldsWithValidationRef.current.size &&
                isEmptyObject(errorsRef.current);
    }
    const formState = {
        dirty: isDirtyRef.current,
        dirtyFields: dirtyFieldsRef.current,
        isSubmitted: isSubmittedRef.current,
        submitCount: submitCountRef.current,
        touched: touchedFieldsRef.current,
        isSubmitting: isSubmittingRef.current,
        isValid: isOnSubmit
            ? isSubmittedRef.current && isEmptyObject(errorsRef.current)
            : isValidRef.current,
    };
    const control = Object.assign(Object.assign({ register,
        unregister,
        removeFieldEventListener,
        getValues,
        setValue,
        triggerValidation }, (shouldValidateCallback ? { validateSchemaIsValid } : {})), { formState, mode: {
            isOnBlur,
            isOnSubmit,
        }, reValidateMode: {
            isReValidateOnBlur,
            isReValidateOnSubmit,
        }, errorsRef,
        touchedFieldsRef,
        fieldsRef,
        resetFieldArrayFunctionRef,
        validFieldsRef,
        fieldsWithValidationRef,
        watchFieldArrayRef,
        fieldArrayNamesRef,
        isDirtyRef,
        readFormStateRef,
        defaultValuesRef });
    return {
        watch,
        control,
        handleSubmit,
        setValue,
        triggerValidation,
        getValues: useCallback(getValues, []),
        reset: useCallback(reset, []),
        register: useCallback(register, [
            defaultValuesRef.current,
            defaultRenderValuesRef.current,
        ]),
        unregister: useCallback(unregister, []),
        clearError: useCallback(clearError, []),
        setError: useCallback(setError, []),
        errors: errorsRef.current,
        formState: isProxyEnabled
            ? new Proxy(formState, {
                get: (obj, prop) => {
                    if (prop in obj) {
                        readFormStateRef.current[prop] = true;
                        return obj[prop];
                    }
                    return {};
                },
            })
            : formState,
    };
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const FormGlobalContext = React.createContext(null);
function useFormContext() {
    const context = React.useContext(FormGlobalContext);
    if (!isUndefined(context))
        return context;
    throw new Error('Missing FormContext');
}
function FormContext(_a) {
    var { children, formState, errors } = _a, restMethods = __rest(_a, ["children", "formState", "errors"]);
    return (React.createElement(FormGlobalContext.Provider, { value: Object.assign(Object.assign({}, restMethods), { formState, errors }) }, children));
}

var generateId = () => {
    const d = typeof performance === UNDEFINED ? Date.now() : performance.now() * 1000;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16 + d) % 16 | 0;
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

const appendId = (value, keyName) => (Object.assign(Object.assign({}, (isObject(value) ? value : { value })), { [keyName]: generateId() }));
const mapIds = (data, keyName) => (isArray(data) ? data : []).map(value => appendId(value, keyName));

var removeArrayAt = (data, index) => isUndefined(index)
    ? []
    : data.filter((_, i) => (isArray(index) ? index : [index]).indexOf(i) < 0);

var moveArrayAt = (data, from, to) => isArray(data) ? data.splice(to, 0, data.splice(from, 1)[0]) : [];

var swapArrayAt = (fields, indexA, indexB) => isArray(fields) &&
    ([fields[indexA], fields[indexB]] = [fields[indexB], fields[indexA]]);

var prependAt = (data, value) => [
    ...(isArray(value) ? value : [value || null]),
    ...data,
];

var insertAt = (data, index, value) => [
    ...data.slice(0, index),
    ...(isArray(value) ? value : [value || null]),
    ...data.slice(index),
];

var fillEmptyArray = (value) => isArray(value) ? Array(value.length).fill(null) : undefined;

const { useEffect: useEffect$1, useRef: useRef$1, useState: useState$1 } = React;
const useFieldArray = ({ control, name, keyName = 'id', }) => {
    const methods = useFormContext();
    const { resetFieldArrayFunctionRef, fieldArrayNamesRef, fieldsRef, getValues, defaultValuesRef, removeFieldEventListener, errorsRef, isDirtyRef, touchedFieldsRef, readFormStateRef, watchFieldArrayRef, validFieldsRef, fieldsWithValidationRef, validateSchemaIsValid, } = control || methods.control;
    const memoizedDefaultValues = useRef$1(get(defaultValuesRef.current, name, []));
    const [fields, setField] = useState$1(mapIds(memoizedDefaultValues.current, keyName));
    const appendValueWithKey = (value) => value.map((v) => appendId(v, keyName));
    const commonTasks = (fieldsValues) => {
        watchFieldArrayRef.current[name] = fieldsValues;
        setField(fieldsValues);
        if (readFormStateRef.current.isValid && validateSchemaIsValid) {
            validateSchemaIsValid({
                [name]: fieldsValues,
            });
        }
    };
    const resetFields = (flagOrFields) => {
        if (readFormStateRef.current.dirty) {
            isDirtyRef.current = isUndefined(flagOrFields)
                ? true
                : getIsFieldsDifferent(flagOrFields, memoizedDefaultValues.current);
        }
        for (const key in fieldsRef.current) {
            if (isMatchFieldArrayName(key, name) && fieldsRef.current[key]) {
                removeFieldEventListener(fieldsRef.current[key], true);
            }
        }
    };
    const mapCurrentFieldsValueWithState = () => {
        const currentFieldsValue = getValues({ nest: true })[name];
        if (isArray(currentFieldsValue)) {
            for (let i = 0; i < currentFieldsValue.length; i++) {
                fields[i] = Object.assign(Object.assign({}, fields[i]), currentFieldsValue[i]);
            }
        }
    };
    const append = (value) => {
        mapCurrentFieldsValueWithState();
        if (readFormStateRef.current.dirty) {
            isDirtyRef.current = true;
        }
        commonTasks([
            ...fields,
            ...(isArray(value)
                ? appendValueWithKey(value)
                : [appendId(value, keyName)]),
        ]);
    };
    const prepend = (value) => {
        mapCurrentFieldsValueWithState();
        resetFields();
        commonTasks(prependAt(fields, isArray(value) ? appendValueWithKey(value) : [appendId(value, keyName)]));
        if (errorsRef.current[name]) {
            errorsRef.current[name] = prependAt(errorsRef.current[name], fillEmptyArray(value));
        }
        if (readFormStateRef.current.touched && touchedFieldsRef.current[name]) {
            touchedFieldsRef.current[name] = prependAt(touchedFieldsRef.current[name], fillEmptyArray(value));
        }
    };
    const remove = (index) => {
        if (!isUndefined(index)) {
            mapCurrentFieldsValueWithState();
        }
        resetFields(removeArrayAt(getFieldValueByName(fieldsRef.current, name), index));
        commonTasks(removeArrayAt(fields, index));
        if (errorsRef.current[name]) {
            errorsRef.current[name] = removeArrayAt(errorsRef.current[name], index);
        }
        if (readFormStateRef.current.touched && touchedFieldsRef.current[name]) {
            touchedFieldsRef.current[name] = removeArrayAt(touchedFieldsRef.current[name], index);
        }
        if (readFormStateRef.current.isValid && !validateSchemaIsValid) {
            fields.forEach((field, fieldIndex) => {
                if (isUndefined(index) ||
                    fieldIndex === index ||
                    (isArray(index) && index.indexOf(fieldIndex) >= 0)) {
                    for (const key in field) {
                        const removeFieldName = `${name}[${index}].${key}`;
                        validFieldsRef.current.delete(removeFieldName);
                        fieldsWithValidationRef.current.delete(removeFieldName);
                    }
                }
            });
        }
    };
    const insert = (index, value) => {
        mapCurrentFieldsValueWithState();
        resetFields(insertAt(getFieldValueByName(fieldsRef.current, name), index));
        commonTasks(insertAt(fields, index, isArray(value) ? appendValueWithKey(value) : [appendId(value, keyName)]));
        if (errorsRef.current[name]) {
            errorsRef.current[name] = insertAt(errorsRef.current[name], index, fillEmptyArray(value));
        }
        if (readFormStateRef.current.touched && touchedFieldsRef.current[name]) {
            touchedFieldsRef.current[name] = insertAt(touchedFieldsRef.current[name], index, fillEmptyArray(value));
        }
    };
    const swap = (indexA, indexB) => {
        mapCurrentFieldsValueWithState();
        const fieldValues = getFieldValueByName(fieldsRef.current, name);
        swapArrayAt(fieldValues, indexA, indexB);
        resetFields(fieldValues);
        swapArrayAt(fields, indexA, indexB);
        commonTasks([...fields]);
        if (errorsRef.current[name]) {
            swapArrayAt(errorsRef.current[name], indexA, indexB);
        }
        if (readFormStateRef.current.touched && touchedFieldsRef.current[name]) {
            swapArrayAt(touchedFieldsRef.current[name], indexA, indexB);
        }
    };
    const move = (from, to) => {
        mapCurrentFieldsValueWithState();
        const fieldValues = getFieldValueByName(fieldsRef.current, name);
        moveArrayAt(fieldValues, from, to);
        resetFields(fieldValues);
        moveArrayAt(fields, from, to);
        commonTasks([...fields]);
        if (errorsRef.current[name]) {
            moveArrayAt(errorsRef.current[name], from, to);
        }
        if (readFormStateRef.current.touched && touchedFieldsRef.current[name]) {
            moveArrayAt(touchedFieldsRef.current[name], from, to);
        }
    };
    const reset = () => {
        resetFields();
        memoizedDefaultValues.current = get(defaultValuesRef.current, name, []);
        setField(mapIds(memoizedDefaultValues.current, keyName));
    };
    useEffect$1(() => {
        const resetFunctions = resetFieldArrayFunctionRef.current;
        const fieldArrayNames = fieldArrayNamesRef.current;
        fieldArrayNames.add(name);
        resetFunctions[name] = reset;
        watchFieldArrayRef.current[name] = {};
        return () => {
            resetFields();
            delete resetFunctions[name];
            fieldArrayNames.delete(name);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return {
        swap,
        move,
        prepend,
        append,
        remove,
        insert,
        fields,
    };
};

var getInputValue = (target, isCheckbox) => {
    if (isNullOrUndefined(target)) {
        return target;
    }
    return isCheckbox
        ? isUndefined(target.checked)
            ? target
            : target.checked
        : isUndefined(target.value)
            ? target
            : target.value;
};

const Controller = (_a) => {
    var { name, rules, as: InnerComponent, onBlur, onChange, onChangeName = VALIDATION_MODE.onChange, onBlurName = VALIDATION_MODE.onBlur, valueName, defaultValue, control } = _a, rest = __rest(_a, ["name", "rules", "as", "onBlur", "onChange", "onChangeName", "onBlurName", "valueName", "defaultValue", "control"]);
    const methods = useFormContext();
    const { defaultValuesRef, setValue, register, unregister, errorsRef, removeFieldEventListener, triggerValidation, mode: { isOnSubmit, isOnBlur }, reValidateMode: { isReValidateOnBlur, isReValidateOnSubmit }, formState: { isSubmitted }, fieldsRef, fieldArrayNamesRef, } = control || methods.control;
    const [value, setInputStateValue] = React.useState(isUndefined(defaultValue)
        ? get(defaultValuesRef.current, name)
        : defaultValue);
    const valueRef = React.useRef(value);
    const isCheckboxInput = isBoolean(value);
    const shouldValidate = () => !skipValidation({
        hasError: !!get(errorsRef.current, name),
        isOnBlur,
        isOnSubmit,
        isReValidateOnBlur,
        isReValidateOnSubmit,
        isSubmitted,
    });
    const commonTask = (target) => {
        const data = getInputValue(target, isCheckboxInput);
        setInputStateValue(data);
        valueRef.current = data;
        return data;
    };
    const eventWrapper = (event) => (...arg) => setValue(name, commonTask(event(arg)), shouldValidate());
    const handleChange = (e) => {
        const data = commonTask(e && e.target ? e.target : e);
        setValue(name, data, shouldValidate());
    };
    const registerField = () => {
        if (isNameInFieldArray(fieldArrayNamesRef.current, name) &&
            fieldsRef.current[name]) {
            removeFieldEventListener(fieldsRef.current[name], true);
        }
        register(Object.defineProperty({ name }, VALUE, {
            set(data) {
                setInputStateValue(data);
                valueRef.current = data;
            },
            get() {
                return valueRef.current;
            },
        }), Object.assign({}, rules));
    };
    if (!fieldsRef.current[name]) {
        registerField();
        setInputStateValue(isUndefined(defaultValue)
            ? get(defaultValuesRef.current, name)
            : defaultValue);
    }
    React.useEffect(() => {
        registerField();
        return () => {
            if (!isNameInFieldArray(fieldArrayNamesRef.current, name)) {
                unregister(name);
            }
        };
    }, [name]);
    const shouldReValidateOnBlur = isOnBlur || isReValidateOnBlur;
    const props = Object.assign(Object.assign(Object.assign(Object.assign({ name }, rest), (onChange
        ? { [onChangeName]: eventWrapper(onChange) }
        : { [onChangeName]: handleChange })), (onBlur || shouldReValidateOnBlur
        ? {
            [onBlurName]: (...args) => {
                if (onBlur) {
                    onBlur(args);
                }
                if (shouldReValidateOnBlur) {
                    triggerValidation(name);
                }
            },
        }
        : {})), { [valueName || (isCheckboxInput ? 'checked' : VALUE)]: value });
    return React.isValidElement(InnerComponent) ? (React.cloneElement(InnerComponent, props)) : (React.createElement(InnerComponent, Object.assign({}, props)));
};

const ErrorMessage = (_a) => {
    var { as: InnerComponent, errors, name, message, children } = _a, rest = __rest(_a, ["as", "errors", "name", "message", "children"]);
    const methods = useFormContext();
    const error = get(errors || methods.errors, name);
    if (!error) {
        return null;
    }
    const { message: messageFromRegister, types } = error;
    const props = Object.assign(Object.assign({}, (InnerComponent ? rest : {})), { children: children
            ? children({ message: messageFromRegister || message, messages: types })
            : messageFromRegister || message });
    return InnerComponent ? (React.isValidElement(InnerComponent) ? (React.cloneElement(InnerComponent, props)) : (React.createElement(InnerComponent, props))) : (React.createElement(React.Fragment, Object.assign({}, props)));
};

exports.Controller = Controller;
exports.ErrorMessage = ErrorMessage;
exports.FormContext = FormContext;
exports.useFieldArray = useFieldArray;
exports.useForm = useForm;
exports.useFormContext = useFormContext;
