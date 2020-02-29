import process from "process"
import { promises as fs } from "fs"
import path from "path"

import { parse, percentage } from "./lcov"
import { tabulate } from "./tabulate"
import { details, summary, b, fragment } from "./html"

async function main() {
	const file = process.argv[2]
	const prefix = path.dirname(path.dirname(path.resolve(file))) + "/"

	const content = await fs.readFile(file, "utf-8")
	const lcov = await parse(content)
	const options = {
		repository: "example/foo",
		commit: "f9d42291812ed03bb197e48050ac38ac6befe4e5",
		prefix,
	}

	const comment = fragment(
		"Total Coverage: ",
		b(`${percentage(lcov).toFixed(2)}%`),
		"\n\n",
		details(
			summary("Coverage Report"),
			tabulate(lcov, options),
		)
	)

	console.log(comment)
}

main().catch(function (err) {
	console.log(err)
	process.exit(1)
})
