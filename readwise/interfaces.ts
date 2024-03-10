export interface Tag {
	id: number;
	name: string;
}

export interface Highlight {
	id: number;
	text: string;
	note: string;
	location: number;
	location_type: string;
	highlighted_at: string | null;
	url: string | null;
	color: string;
	updated: string;
	book_id: number;
	tags: Tag[];
}

export interface HighlightResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Highlight[];
}
