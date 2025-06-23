import { z } from "zod"
import { WidgetElement } from "@/config/available-widgets"

export function schemaFromWidget(widget: WidgetElement) {
    const shape: Record<string, z.ZodType> = {}
    widget.form.forEach((field) => {
        let zodType
        switch (field.type) {
            case 'string':
                zodType = z.string()
                break
            case 'number':
                zodType = z.number()
                break
            case 'checkbox':
                zodType = z.boolean().optional()
                break
        }
        const name = field.codeName
        shape[name] = zodType
    })
    return z.object(shape)
}
