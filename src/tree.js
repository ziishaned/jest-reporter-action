export function tree(files, options) {
	const result = {}

	files.forEach(function (file) {
		file.file
			.replace(options.prefix, "")
			.split("/")
			.reduce(function (acc, part, index, arr) {
				if (index === arr.length - 1) {
					acc[part] = file
					return acc[part]
				}

				acc[part] = acc[part] || {}
				return acc[part]
			}, result)
	})

	return result
}
