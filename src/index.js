const core = require("@actions/core")
const fs = require("fs").promises
const lcov = require("lcov-parse")
const { GitHub, context } = require("@actions/github")

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
`

	const client = new GitHub(token)
	await client.issues.createComment({
		repo: context.repo.repo,
		owner: context.repo.owner,
		issue_number: await PR(),
		body: comment,
	})
}

// Read the PR number from the GITHUB_EVENT_PATH
async function PR() {
	const data = await fs.readFile(process.env.GITHUB_EVENT_PATH, 'utf8')
	const event = JSON.parse(data)
	return event.pull_request.number
}

// Parse lcov string into lcov data
function parse(data) {
	return new Promise(function (resolve, reject) {
		parse(data, function (err, res) {
			if (err) {
				reject(err)
				return
			}
			resolve(data)
		})
	})
}

// Get the total coverage percentage from the lcov data.
function percentage(lcov) {
	let hit = 0
	let found = 0
	for (const entry of lcov) {
		hit += entry.lines.hit
		found += entry.lines.found
	}

	return (hit / found) * 100
}

main().catch(err => core.setFailed(err.message))
