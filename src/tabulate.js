import { tree } from './tree'

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

	return (
		`
		<table>
			<tbody>
				${head}
				${rows.join("")}
			</tbody>
		</table>
		`
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
	return tr(
		`<td colspan='5'><b>${path}</b></td>`,
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
	return `&nbsp; &nbsp;<a href='${href}'>${last}</a>`
}

function percentage(item) {
	if (!item) {
		return 'N/A'
	}

	const value = item.found === 0 ? 100 : item.hit / item.found * 100
	const rounded = value.toFixed(2).replace(/\.0*$/, '')

	const tag =
		value === 100
			? 'span'
			: 'b'

	return `<${tag}>${rounded}%</${tag}>`
}

function th(...str) {
	return `<th>${str.join('\n')}</th>`
}

function td (...str) {
	return `<td>${str.join('\n')}</td>`
}

function tr (...str) {
	return `<tr>${str.join('\n')}</tr>`
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
				return `<a href=${href}>${line}</a>`
			})
			.join(", ")
	)
}
