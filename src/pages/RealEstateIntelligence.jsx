import ProductPage from './product/ProductPage'
import { RI } from './product/content'

// /realestate-intelligence — shared product template (specs/product-pages.md), RI content.
export default function RealEstateIntelligence() {
  return <ProductPage content={RI} />
}
