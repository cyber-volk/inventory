import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { withRoleCheck } from "@/components/with-role-check"

function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Settings</h1>
      <form className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Enter company name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email" />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" placeholder="Enter currency" />
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  )
}

export default withRoleCheck(SettingsPage, ["admin"])

