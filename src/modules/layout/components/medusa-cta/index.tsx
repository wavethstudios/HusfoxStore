import { Text } from "@medusajs/ui"

import Medusa from "../../../common/icons/medusa"
import NextJs from "../../../common/icons/nextjs"

const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      Powered by
      <a href="https://www.waveth.com" target="_blank" rel="noreferrer">
        Waveth Studios
      </a>
    </Text>
  )
}

export default MedusaCTA
