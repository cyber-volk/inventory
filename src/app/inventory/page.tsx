import { DataTable } from '../../../lib/components/data-table';
import { columns } from './columns';
import { withRoleCheck } from '../../../lib/components/with-role-check';

async function getData() {
    // Your data fetching logic here
}

async function InventoryPage() {
    const data = await getData();
    // Your component logic here
}
