import { useState } from 'react';

import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import { 
  Home, Layers, BarChart2, Map, Filter, LogOut, Users, Database, Menu, X, Search,
  ChevronDown, ChevronUp, Settings, Bell, User
} from 'lucide-react';

// Sample data
const storeData = [
  { id: 1, name: 'Store A', location: 'New York', revenue: 75000, products: 120, lat: 40.7128, lng: -74.0060 },
  { id: 2, name: 'Store B', location: 'Los Angeles', revenue: 92000, products: 150, lat: 34.0522, lng: -118.2437 },
  { id: 3, name: 'Store C', location: 'Chicago', revenue: 68000, products: 110, lat: 41.8781, lng: -87.6298 },
  { id: 4, name: 'Store D', location: 'Houston', revenue: 81000, products: 135, lat: 29.7604, lng: -95.3698 },
  { id: 5, name: 'Store E', location: 'Miami', revenue: 63000, products: 95, lat: 25.7617, lng: -80.1918 },
];

const productData = [
  { id: 1, name: 'Product A', price: 49.99, stock: 230, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 29.99, stock: 150, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, stock: 320, category: 'Home' },
  { id: 4, name: 'Product D', price: 39.99, stock: 180, category: 'Electronics' },
  { id: 5, name: 'Product E', price: 59.99, stock: 90, category: 'Appliances' },
];

const revenueData = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 68000 },
  { month: 'Mar', revenue: 72000 },
  { month: 'Apr', revenue: 75000 },
  { month: 'May', revenue: 82000 },
  { month: 'Jun', revenue: 87000 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Appliances', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    price: null,
    store: null,
    product: null,
    location: null
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  // Apply filter
  const applyFilter = (type, value) => {
    setFilters({
      ...filters,
      [type]: value
    });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      price: null,
      store: null,
      product: null,
      location: null
    });
  };

  // Content for different tabs
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <HomeContent />;
      case 'tables':
        return <TablesContent />;
      case 'graphs':
        return <GraphsContent />;
      case 'map':
        return <MapContent />;
      default:
        return <HomeContent />;
    }
  };

  // Home content component
  function HomeContent() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value="$364,000" icon={<BarChart2 />} trend="+8%" />
          <StatCard title="Total Stores" value="5" icon={<Layers />} trend="+2" />
          <StatCard title="Total Products" value="610" icon={<Database />} trend="+15" />
          <StatCard title="Active Customers" value="2,845" icon={<Users />} trend="+12%" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold p-6 border-b">Top Performing Stores</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {storeData.sort((a, b) => b.revenue - a.revenue).slice(0, 3).map((store) => (
                  <tr key={store.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{store.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${store.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{store.products}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Tables content component
  function TablesContent() {
    const [tableView, setTableView] = useState('stores');
    
    return (
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-md ${tableView === 'stores' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTableView('stores')}
          >
            Stores
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${tableView === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTableView('products')}
          >
            Products
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">{tableView === 'stores' ? 'All Stores' : 'All Products'}</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md"
              />
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {tableView === 'stores' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableView === 'stores' ? (
                  storeData.map((store) => (
                    <tr key={store.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{store.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{store.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${store.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{store.products}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  productData.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t flex justify-between">
            <span className="text-sm text-gray-500">Showing 1-5 of 5 entries</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-200 rounded-md">&laquo;</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
              <button className="px-3 py-1 bg-gray-200 rounded-md">&raquo;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Graphs content component
  function GraphsContent() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Revenue by Store</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Products by Store</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="products" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Map content component
  function MapContent() {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Store Locations</h3>
          <div className="relative h-96 bg-gray-100 rounded-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">Using actual mapping library like Google Maps, Mapbox, or Leaflet</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Store Locations List</h4>
            <div className="space-y-2">
              {storeData.map(store => (
                <div key={store.id} className="p-3 bg-gray-50 rounded-md flex justify-between">
                  <div>
                    <span className="font-medium">{store.name}</span>
                    <span className="text-gray-500 ml-2">{store.location}</span>
                  </div>
                  <span className="text-blue-600 cursor-pointer">View on Map</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stats card component
  function StatCard({ title, value, icon, trend }) {
    const isTrendPositive = trend.startsWith('+');
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            {icon}
          </div>
        </div>
        <div className={`mt-4 text-sm ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend} {isTrendPositive ? 'increase' : 'decrease'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-slate-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">SuperAdmin</h1>
          ) : (
            <h1 className="text-xl font-bold">SA</h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-slate-700">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <button 
              className={`flex items-center ${activeTab === 'home' ? 'bg-slate-700' : 'hover:bg-slate-700'} text-white w-full px-4 py-3 rounded-md`}
              onClick={() => setActiveTab('home')}
            >
              <Home className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>
            
            <button 
              className={`flex items-center ${activeTab === 'tables' ? 'bg-slate-700' : 'hover:bg-slate-700'} text-white w-full px-4 py-3 rounded-md`}
              onClick={() => setActiveTab('tables')}
            >
              <Layers className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Tables</span>}
            </button>
            
            <button 
              className={`flex items-center ${activeTab === 'graphs' ? 'bg-slate-700' : 'hover:bg-slate-700'} text-white w-full px-4 py-3 rounded-md`}
              onClick={() => setActiveTab('graphs')}
            >
              <BarChart2 className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Graphs</span>}
            </button>
            
            <button 
              className={`flex items-center ${activeTab === 'map' ? 'bg-slate-700' : 'hover:bg-slate-700'} text-white w-full px-4 py-3 rounded-md`}
              onClick={() => setActiveTab('map')}
            >
              <Map className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Map</span>}
            </button>
          </nav>
          
          {sidebarOpen && (
            <div className="mt-8 px-4">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Administration</h2>
              <nav className="space-y-1">
                <button className="flex items-center hover:bg-slate-700 text-white w-full px-4 py-3 rounded-md">
                  <Users className="h-5 w-5" />
                  <span className="ml-3">Manage Users</span>
                </button>
                
                <button className="flex items-center hover:bg-slate-700 text-white w-full px-4 py-3 rounded-md">
                  <Database className="h-5 w-5" />
                  <span className="ml-3">Manage Data</span>
                </button>
                
                <button className="flex items-center hover:bg-slate-700 text-white w-full px-4 py-3 rounded-md">
                  <Settings className="h-5 w-5" />
                  <span className="ml-3">Settings</span>
                </button>
              </nav>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-700">
          <button className="flex items-center hover:bg-slate-700 text-white w-full px-4 py-3 rounded-md">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2" onClick={toggleFilterPanel}>
                <Filter className="h-5 w-5" />
                {Object.values(filters).some(filter => filter !== null) && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              <button className="relative p-2">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8" />
                <span className="font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Filter panel */}
        {filterPanelOpen && (
          <div className="bg-white shadow-md p-4 z-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Data Filters</h3>
              <button 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.price || ''}
                  onChange={(e) => applyFilter('price', e.target.value || null)}
                >
                  <option value="">All Prices</option>
                  <option value="0-25">$0 - $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">$100+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.store || ''}
                  onChange={(e) => applyFilter('store', e.target.value || null)}
                >
                  <option value="">All Stores</option>
                  {storeData.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.product || ''}
                  onChange={(e) => applyFilter('product', e.target.value || null)}
                >
                  <option value="">All Products</option>
                  {productData.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.location || ''}
                  onChange={(e) => applyFilter('location', e.target.value || null)}
                >
                  <option value="">All Locations</option>
                  {storeData.map(store => (
                    <option key={store.id} value={store.location}>{store.location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
