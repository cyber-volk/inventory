"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from '../../components/ui/use-toast';
import { BarcodeScanner } from "@/components/barcode-scanner"

const movementSchema = z.object({
  type: z.enum(["PURCHASE", "SALE", "ADJUSTMENT", "TRANSFER", "RETURN", "WRITE_OFF"]),
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export default function NewStockMovementPage() {
  const [step, setStep] = useState(1)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)

  const form = useForm<z.infer<typeof movementSchema>>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: "PURCHASE",
      itemId: "",
      quantity: 1,
      reference: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof movementSchema>) {
    // In a real app, you would send this data to your API here.
    console.log(values)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toast({
      title: "Stock movement created",
      description: "The stock movement has been successfully recorded.",
    })
  }

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedBarcode(data)
      form.setValue("itemId", data)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">New Stock Movement</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movement Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a movement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PURCHASE">Purchase</SelectItem>
                        <SelectItem value="SALE">Sale</SelectItem>
                        <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                        <SelectItem value="TRANSFER">Transfer</SelectItem>
                        <SelectItem value="RETURN">Return</SelectItem>
                        <SelectItem value="WRITE_OFF">Write Off</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of stock movement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => setStep(2)}>Next</Button>
            </>
          )}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Item ID or Barcode" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the item ID or scan the barcode.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <BarcodeScanner onScan={handleScan} />
              {scannedBarcode && <p>Scanned Barcode: {scannedBarcode}</p>}
              <Button type="button" onClick={() => setStep(3)}>Next</Button>
            </>
          )}
          {step === 3 && (
            <>
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the quantity for this movement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a reference number (e.g., PO number, invoice number).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Add any additional notes for this movement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Stock Movement</Button>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}
