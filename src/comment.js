import { details, summary, b, fragment, table, tbody, tr, th } from "./html"

import { percentage } from "./lcov"
import { tabulate } from "./tabulate"

export function comment (lcov, options) {
	return fragment(
		`Coverage after merging ${b(options.head)} into ${b(options.base)}`,
		table(tbody(tr(th(percentage(lcov).toFixed(2), "%")))),
		"\n\n",
		details(summary("Coverage Report"), tabulate(lcov, options)),
	)
}
