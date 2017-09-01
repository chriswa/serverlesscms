import fieldComponents from './crudFieldTypes.js'

export default {
	newRecord(fields) {
		return _.mapValues(fields, (field, fieldId) => {
			if (field.default !== undefined) {
				return field.default
			}
			const fieldType = field.type || 'text'
			return fieldComponents[fieldType].default
		})
	}
}
