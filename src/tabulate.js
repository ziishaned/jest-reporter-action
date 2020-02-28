import { tree } from "./tree"
import { th, tr, td, table, tbody, a, b, span, fragment } from "./html"

// Tabulate the lcov data in a HTML table.
export function tabulate (lcov, options = {}) {
	const head = tr(
		th('File'),
		th('Branch'),
		th('Funcs'),
		th('Lines'),
		th('Uncovered Lines'),
	)
	const t = tree(lcov, options)
	const rows = walk(t, 0, '', options)

	return table(
		tbody(
			head,
			...rows,
		)
	)
}

function walk(tree, depth, prefix, options) {
	return (
		Object.keys(tree)
			.map(function (key) {
				const item = tree[key]
				if (item.file) {
					return toRow(item, options)
				}

				const head = toFolder(prefix, key, depth)
				const rest = walk(item, depth + 1, `${prefix}/${key}`, options)

				return head + rest.join("")
			})
	)
}

function toFolder (prefix, key, depth) {
	const path = `${prefix}/${key}`.replace(/^\//, "")
	if (path === "") {
			return ""
	}

	return tr(
		td(
			{ colspan: 5 },
			b(path),
		)
	)
}

function toRow(file, options) {
	return tr(
		td(filename(file, options)),
		td(percentage(file.branches, options)),
		td(percentage(file.functions, options)),
		td(percentage(file.lines, options)),
		td(uncovered(file, options)),
	)
}

function filename(file, options) {
	const relative = file.file.replace(options.prefix, "")
	const href = `https://github.com/${options.repository}/blob/${options.commit}/${relative}`
	const parts = relative.split("/")
	const last = parts[parts.length - 1]
	return fragment(
		`&nbsp; &nbsp;`,
		a({ href }, last),
	)
}

function percentage(item) {
	if (!item) {
		return 'N/A'
	}

	const value = item.found === 0 ? 100 : item.hit / item.found * 100
	const rounded = value.toFixed(2).replace(/\.0*$/, '')

	const tag =
		value === 100
			? span
			: b

	return tag(`${rounded}%`)
}

function uncovered(file, options) {
	const branches =
		file.branches.details
			.filter(branch => branch.taken === 0)
			.map(branch => branch.line)

	const lines =
		file.lines.details
			.filter(line => line.hit === 0)
			.map(line => line.line)

	const all = [ ...branches, ...lines ].sort()

	return (
		all
			.map(function (line) {
				const relative = file.file.replace(options.prefix, '')
				const href = `https://github.com/${options.repository}/blob/${options.commit}/${relative}#L${line}`
				return a({ href }, line)
			})
			.join(", ")
	)
}
