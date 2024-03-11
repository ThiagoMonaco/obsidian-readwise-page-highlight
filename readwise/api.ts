import { HighlightResponse } from "./interfaces";

export class ReadwiseApi {
	authToken: string

	constructor(authToken: string) {
		this.authToken = authToken
	}

	async getHighlights(updatedAfter: string, pageCursor = ''): Promise<HighlightResponse> {
		const url = new URL("https://readwise.io/api/v2/export")

		updatedAfter !== "" && url.searchParams.append("updatedAfter", updatedAfter)
		pageCursor !== "" && url.searchParams.append("pageCursor", pageCursor)

		const response = await fetch(url, {
			headers: {
				Authorization: `Token ${this.authToken}`
			},
			method: "GET"
		})

		const parsedResponse: HighlightResponse = await response.json()
		if (parsedResponse.nextPageCursor) {
			const nextPage = await this.getHighlights(updatedAfter, parsedResponse.nextPageCursor)
			parsedResponse.results.push(...nextPage.results)
			parsedResponse.count += nextPage.count
		}
		return parsedResponse
  }
}
