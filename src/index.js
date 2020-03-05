import { promises as fs } from "fs"
import core from "@actions/core"
import { GitHub, context } from "@actions/github"

import { parse, percentage } from "./lcov"
import { tabulate } from "./tabulate"
import { details, summary, b, fragment } from "./html"

async function main() {
	const token = core.getInput("github-token")
	const lcovFile = core.getInput("lcov-file") || "./coverage/lcov.info"

	const raw = await fs.readFile(lcovFile, "utf-8").catch(err => null)

	if (!raw) {
		console.log(`No coverage report found at '${lcovFile}', exiting...`)
		return
	}

	const lcov = await parse(raw)
	console.log(JSON.stringify(context, null, 2))

	const options = {
		repository: context.github.repository,
		commit: context.github.event.after,
		prefix: context.github.workspace,
	}

	const comment = fragment(
		"Total Coverage: ",
		b(`${percentage(lcov).toFixed(2)}%`),
		"\n\n",
		details(summary("Coverage Report"), tabulate(lcov, options)),
	)

	await new GitHub(token).issues.createComment({
		repo: context.repo.repo,
		owner: context.repo.owner,
		issue_number: context.gihub.event.pull_request.number,
		body: comment,
	})
}

main().catch(function(err) {
	console.log(err)
	core.setFailed(err.message)
})
