import process from "process"
import { promises as fs } from "fs"
import path from "path"

import { parse } from "./lcov"
import { comment } from "./comment"

async function main() {
	const file = process.argv[2]
	const prefix = path.dirname(path.dirname(path.resolve(file))) + "/"

	const content = await fs.readFile(file, "utf-8")
	const lcov = await parse(content)
	const options = {
		repository: "example/foo",
		commit: "f9d42291812ed03bb197e48050ac38ac6befe4e5",
		prefix,
		head: "feat/test",
		base: "master",
	}

	console.log(comment(lcov, options))
}

main().catch(function(err) {
	console.log(err)
	process.exit(1)
})
