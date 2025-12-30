export interface PropertyRating {
    id?: number;
    property_id: number;
    tenant_id: number;
    rating: number;
    comment?: string;
    reviewer_name?: string;
    reviewer_avatar?: string;
    created_at?: string;
}

export interface UserRating {
    id?: number;
    reviewer_id: number;
    target_user_id: number;
    rating: number;
    comment?: string;
    reviewer_name?: string;
    reviewer_avatar?: string;
    created_at?: string;
}

export interface RatingSummary {
    average_rating: number;
    rating_count: number;
}

export interface PropertyRatingResponse {
    summary: RatingSummary;
    reviews: PropertyRating[];
}

export interface UserRatingResponse {
    summary: RatingSummary;
    reviews: UserRating[];
}
