import { HighlightResponse } from "./interfaces";
import {LocalBooks} from "../domain/LocalBooks";

export class ReadwiseApi {
	authToken: string

	constructor(authToken: string) {
		this.authToken = authToken
	}

	async getHighlights(updatedAfter: string, ids: number[], page = 1): Promise<HighlightResponse> {
	const url = new URL("https://readwise.io/api/v2/highlights/")

	updatedAfter !== "" && url.searchParams.append("updated_after", updatedAfter)
	url.searchParams.append("page", '' + page)
	ids.forEach((id) => url.searchParams.append("book_id", '' + id))

	const response = await fetch(url, {
		headers: {
			Authorization: `Token ${this.authToken}`
		},
		method: "GET"
	})

	const parsedResponse: HighlightResponse = await response.json()
	if (parsedResponse.next) {
		const nextPage = await this.getHighlights(updatedAfter, ids, page + 1)
		parsedResponse.results.push(...nextPage.results)
		parsedResponse.count += nextPage.count
	}
	return parsedResponse
  }

  async getBooks(): Promise<LocalBooks[]> {
	const url = new URL("https://readwise.io/api/v2/books/")
	const response = await fetch(url, {
		headers: {
			Authorization: `Token ${this.authToken}`
		},
	})
	const data = await response.json()

	return data.results.map((book: any) => {
		return {
			title: book.title,
			id: book.id,
			enabled: false
		}
	})
  }
}
