export interface Highlight {
	id: number;
	text: string;
	location: number;
	location_type: string;
	note: string;
	color: string;
	highlighted_at: string;
	created_at: string;
	updated_at: string;
	external_id: string;
	url: string;
	book_id: number;
	tags: any[];
	is_favorite: boolean;
	is_discard: boolean;
	readwise_url: string;
}

export interface Book {
	user_book_id: number;
	title: string;
	author: string;
	readable_title: string;
	source: string;
	cover_image_url: string;
	unique_url: string;
	book_tags: any[];
	category: string;
	document_note: string;
	summary: string;
	readwise_url: string;
	source_url: string;
	highlights: Highlight[];
}

export interface HighlightResponse {
	count: number;
	nextPageCursor: string | null;
	results: Book[];
}
