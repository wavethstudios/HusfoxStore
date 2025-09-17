import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  try {
    console.log("Starting generateStaticParams...")

    // Get categories with error handling
    const product_categories = await listCategories()
    console.log("Categories fetched:", product_categories?.length || 0)

    if (!product_categories || product_categories.length === 0) {
      console.log("No categories found, returning empty array")
      return []
    }

    // Get regions with better error handling
    const regions = await listRegions()
    console.log("Regions fetched:", regions?.length || 0)

    if (!regions || regions.length === 0) {
      console.log("No regions found, returning empty array")
      return []
    }

    // Safely extract country codes with proper typing
    const countryCodes: string[] = regions
      .filter(
        (region: StoreRegion) =>
          region.countries && Array.isArray(region.countries)
      )
      .flatMap(
        (region: StoreRegion) =>
          region.countries
            ?.map((country) => country.iso_2)
            .filter((code): code is string => Boolean(code)) || []
      )

    console.log("Country codes extracted:", countryCodes.length)

    if (countryCodes.length === 0) {
      console.log("No valid country codes found, returning empty array")
      return []
    }

    // Safely extract category handles with proper typing
    const categoryHandles: string[] = product_categories
      .map((category: any) => category?.handle)
      .filter((handle): handle is string => Boolean(handle))

    console.log("Category handles extracted:", categoryHandles.length)

    if (categoryHandles.length === 0) {
      console.log("No valid category handles found, returning empty array")
      return []
    }

    // Generate static params safely - now both arrays are guaranteed to contain strings
    const staticParams = countryCodes.flatMap((countryCode: string) =>
      categoryHandles.map((handle: string) => ({
        countryCode,
        category: [handle],
      }))
    )

    console.log("Static params generated:", staticParams.length)

    // Limit the number of static params to avoid build timeouts
    // Remove this limit if you need all combinations
    const limitedParams = staticParams.slice(0, 1000)

    if (limitedParams.length < staticParams.length) {
      console.log(
        `Limited static params to ${limitedParams.length} from ${staticParams.length}`
      )
    }

    return limitedParams
  } catch (error) {
    console.error("Error in generateStaticParams:", error)
    // Return empty array to prevent build failure
    // Consider if you want the build to fail or continue with empty params
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    console.log("Generating metadata for category:", params.category)

    if (
      !params.category ||
      !Array.isArray(params.category) ||
      params.category.length === 0
    ) {
      console.log("Invalid category params, using notFound")
      notFound()
    }

    const productCategory = await getCategoryByHandle(params.category)

    if (!productCategory) {
      console.log("Product category not found, using notFound")
      notFound()
    }

    const title = productCategory.name + " | Medusa Store"
    const description = productCategory.description ?? `${title} category.`

    return {
      title,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    console.error("Error in generateMetadata:", error)
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  try {
    const searchParams = await props.searchParams
    const params = await props.params
    const { sortBy, page } = searchParams

    console.log("Rendering category page for:", params.category)

    if (
      !params.category ||
      !Array.isArray(params.category) ||
      params.category.length === 0
    ) {
      console.log("Invalid category params in page component")
      notFound()
    }

    const productCategory = await getCategoryByHandle(params.category)

    if (!productCategory) {
      console.log("Product category not found in page component")
      notFound()
    }

    return (
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    )
  } catch (error) {
    console.error("Error in CategoryPage component:", error)
    notFound()
  }
}
