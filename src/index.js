import { promises as fs } from 'fs'
import core from '@actions/core'
import { GitHub, context } from '@actions/github'

import { parse, percentage } from "./lcov"
import { tabulate } from "./tabulate"

async function main() {
	const token = core.getInput("github-token")
	const lcovFile = core.getInput("lcov-file") || "./coverage/lcov.info"

	let raw = null
	try {
		const raw = await fs.readFile(lcovFile)
	} catch(err) {
		console.log(`No coverage report found at '${lcovFile}', exiting...`)
		return
	}

	const lcov = await parse(raw)
	const comment = `
Total Coverage: \`${percentage(lcov).toFixed(2)}%\`

<details>
	<summary>Coverage Report</summary>
	${tabulate(lcov)}
</details>
`

	await new GitHub(token).issues.createComment({
		repo: context.repo.repo,
		owner: context.repo.owner,
		issue_number: (await eventData()).pull_request.number,
		body: comment,
	})
}

// Read the eventData from the GITHUB_EVENT_PATH
async function eventData() {
	const data = await fs.readFile(process.env.GITHUB_EVENT_PATH, 'utf8')
	return JSON.parse(data)
}

main().catch(err => core.setFailed(err.message))
