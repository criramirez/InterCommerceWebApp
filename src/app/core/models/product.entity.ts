export interface Products {
    products: Product[],
    total: number,
    skip: number,
    limit: number
}

export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: Dimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: Review[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: Meta;
    thumbnail: string;
    images: string[];
    quantity?: number;
    finalPrice?: number;
}

export interface Dimensions {
    width: number;
    height: number;
    depth: number;
}

export interface Review {
    rating: number;
    comment: string;
    date: Date;
    reviewerName: string;
    reviewerEmail: string;
}

export interface Meta {
    createdAt: Date;
    updatedAt: Date;
    barcode: string;
    qrCode: string;
}

export interface QuerySearchProduct {
    q?: string,
    limit?: number,
    skip?: number,
    select?: string[],
    sortBy?: ProductFields,
    order?: OrderProduct,
    category?: string
}

export enum ProductFields {
    ID = 'id',
    TITLE = 'title',
    DESCRIPTION = 'description',
    CATEGORY = 'category',
    PRICE = 'price',
    DISCOUNT_PERCENTAGE = 'discountPercentage',
    RATING = 'rating',
    STOCK = 'stock',
    TAGS = 'tags',
    BRAND = 'brand',
    SKU = 'sku',
    WEIGHT = 'weight',
    DIMENSIONS = 'dimensions',
    WARRANTY_INFORMATION = 'warrantyInformation',
    SHIPPING_INFORMATION = 'shippingInformation',
    AVAILABILITY_STATUS = 'availabilityStatus',
    REVIEWS = 'reviews',
    RETURN_POLICY = 'returnPolicy',
    MINIMUM_ORDER_QUANTITY = 'minimumOrderQuantity',
    META = 'meta',
    THUMBNAIL = 'thumbnail',
    IMAGES = 'images'
}

export enum OrderProduct {
    ASC = 'asc',
    DESC = 'desc'
}