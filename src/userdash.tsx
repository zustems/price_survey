import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Clock, 
  ShoppingCart, 
  Save,
  Edit,
  Trash2,
  Plus,
  Search
} from 'lucide-react';

// Sample data
const storeData = [
  { id: 1, name: 'Store A', location: 'New York', address: '123 Broadway Ave', city: 'New York' },
  { id: 2, name: 'Store B', location: 'Los Angeles', address: '456 Sunset Blvd', city: 'Los Angeles' },
  { id: 3, name: 'Store C', location: 'Chicago', address: '789 Michigan Ave', city: 'Chicago' },
  { id: 4, name: 'Store D', location: 'Houston', address: '101 Texas St', city: 'Houston' },
  { id: 5, name: 'Store E', location: 'Miami', address: '202 Ocean Dr', city: 'Miami' },
];

const productData = [
  { id: 1, name: 'Product A', price: 49.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 29.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Home' },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics' },
  { id: 5, name: 'Product E', price: 59.99, category: 'Appliances' },
];

const initialInventoryData = [
  { id: 1, storeId: 1, productId: 1, quantity: 24, price: 49.99 },
  { id: 2, storeId: 1, productId: 2, quantity: 30, price: 29.99 },
  { id: 3, storeId: 2, productId: 1, quantity: 18, price: 52.99 },
  { id: 4, storeId: 3, productId: 3, quantity: 45, price: 19.99 },
  { id: 5, storeId: 4, productId: 5, quantity: 15, price: 62.99 },
];

const userProfile = {
  name: 'Sarah Johnson',
  email: 'sarah.j@company.com',
  role: 'Store Manager'
};

// History data for user actions
const initialHistoryData = [
  { id: 1, action: 'Updated Product A quantity at Store A', timestamp: '2025-04-27T14:22:00' },
  { id: 2, action: 'Changed Product B price at Store A', timestamp: '2025-04-26T09:15:00' },
  { id: 3, action: 'Added Product C to Store B inventory', timestamp: '2025-04-25T16:30:00' },
  { id: 4, action: 'Removed Product D from Store C inventory', timestamp: '2025-04-24T11:45:00' },
];

export default function UserAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [historyData, setHistoryData] = useState(initialHistoryData);
  const [activeTab, setActiveTab] = useState('inventory');
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formError, setFormError] = useState('');

  // Reset form fields when store or product selection changes
  useEffect(() => {
    if (selectedStore && selectedProduct) {
      const existingInventory = inventoryData.find(
        item => item.storeId === selectedStore.id && item.productId === selectedProduct.id
      );
      
      if (existingInventory && editingInventoryId) {
        setQuantity(existingInventory.quantity.toString());
        setPrice(existingInventory.price.toString());
      } else {
        setQuantity('');
        setPrice('');
      }
    } else {
      setQuantity('');
      setPrice('');
    }
  }, [selectedStore, selectedProduct, editingInventoryId]);

  // Handle form submission for adding/updating inventory
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedStore || !selectedProduct) {
      setFormError('Please select both a store and a product');
      return;
    }
    
    if (!quantity) {
      setFormError('Please enter a quantity');
      return;
    }
    
    if (!price) {
      setFormError('Please enter a price');
      return;
    }
    
    setFormError('');
    
    const numQuantity = parseInt(quantity);
    const numPrice = parseFloat(price);
    
    if (isNaN(numQuantity) || numQuantity < 0) {
      setFormError('Please enter a valid quantity');
      return;
    }
    
    if (isNaN(numPrice) || numPrice < 0) {
      setFormError('Please enter a valid price');
      return;
    }
    
    // Check if we're editing an existing item or adding a new one
    if (editingInventoryId) {
      // Update existing inventory
      const updatedInventory = inventoryData.map(item => 
        item.id === editingInventoryId 
          ? { ...item, quantity: numQuantity, price: numPrice } 
          : item
      );
      
      setInventoryData(updatedInventory);
      addHistoryRecord(`Updated ${selectedProduct.name} at ${selectedStore.name}`);
      setEditingInventoryId(null);
    } else {
      // Check if this store/product combination already exists
      const existingIndex = inventoryData.findIndex(
        item => item.storeId === selectedStore.id && item.productId === selectedProduct.id
      );
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updatedInventory = [...inventoryData];
        updatedInventory[existingIndex] = {
          ...updatedInventory[existingIndex],
          quantity: numQuantity,
          price: numPrice
        };
        
        setInventoryData(updatedInventory);
        addHistoryRecord(`Updated ${selectedProduct.name} at ${selectedStore.name}`);
      } else {
        // Add new entry
        const newInventoryItem = {
          id: inventoryData.length > 0 ? Math.max(...inventoryData.map(item => item.id)) + 1 : 1,
          storeId: selectedStore.id,
          productId: selectedProduct.id,
          quantity: numQuantity,
          price: numPrice
        };
        
        setInventoryData([...inventoryData, newInventoryItem]);
        addHistoryRecord(`Added ${selectedProduct.name} to ${selectedStore.name}`);
      }
    }
    
    // Reset form
    setSelectedStore(null);
    setSelectedProduct(null);
    setQuantity('');
    setPrice('');
  };

  // Add a new history record
  const addHistoryRecord = (action) => {
    const newRecord = {
      id: historyData.length > 0 ? Math.max(...historyData.map(item => item.id)) + 1 : 1,
      action,
      timestamp: new Date().toISOString()
    };
    
    setHistoryData([newRecord, ...historyData]);
  };

  // Handle delete inventory item
  const handleDeleteInventory = (id) => {
    const itemToDelete = inventoryData.find(item => item.id === id);
    if (!itemToDelete) return;
    
    const store = storeData.find(s => s.id === itemToDelete.storeId);
    const product = productData.find(p => p.id === itemToDelete.productId);
    
    const updatedInventory = inventoryData.filter(item => item.id !== id);
    setInventoryData(updatedInventory);
    
    addHistoryRecord(`Removed ${product.name} from ${store.name}`);
  };

  // Handle edit inventory item
  const handleEditInventory = (id) => {
    const itemToEdit = inventoryData.find(item => item.id === id);
    if (!itemToEdit) return;
    
    const store = storeData.find(s => s.id === itemToEdit.storeId);
    const product = productData.find(p => p.id === itemToEdit.productId);
    
    setSelectedStore(store);
    setSelectedProduct(product);
    setQuantity(itemToEdit.quantity.toString());
    setPrice(itemToEdit.price.toString());
    setEditingInventoryId(id);
  };

  // Filter inventory data based on search term
  const filteredInventory = inventoryData.filter(item => {
    const store = storeData.find(s => s.id === item.storeId);
    const product = productData.find(p => p.id === item.productId);
    
    return (
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-slate-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">StoreAdmin</h1>
          ) : (
            <h1 className="text-xl font-bold">SA</h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-slate-700">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 rounded-full p-2 mr-3">
              <User size={24} />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-medium">{userProfile.name}</h2>
                <p className="text-sm text-gray-300">{userProfile.role}</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <div className="text-sm text-gray-300 mb-2">
              {userProfile.email}
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <button 
              className={`flex items-center ${activeTab === 'inventory' ? 'bg-slate-700' : 'hover:bg-slate-700'} text-white w-full px-4 py-3 rounded-md`}
              onClick={() => setActiveTab('inventory')}
            >
              <ShoppingCart className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Inventory</span>}
            </button>
            
            <button 
              className={`flex items-center ${activeTab === 'history' ? 'bg-slate-700' : 'hover:bg-slate-700'} text-white w-full px-4 py-3 rounded-md`}
              onClick={() => setActiveTab('history')}
            >
              <Clock className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">History</span>}
            </button>
          </nav>
        </div>
        
        {/* Logout Button */}
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
            <h2 className="text-2xl font-bold">
              {activeTab === 'inventory' ? 'Inventory Management' : 'Action History'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {activeTab === 'inventory' ? (
            <div className="space-y-6">
              {/* Inventory Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {editingInventoryId ? 'Edit Inventory Item' : 'Add/Update Inventory'}
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
                      <div className="relative">
                        <select 
                          className="w-full border rounded-md px-3 py-2 appearance-none"
                          value={selectedStore ? selectedStore.id : ''}
                          onChange={(e) => {
                            const storeId = parseInt(e.target.value);
                            const store = storeData.find(s => s.id === storeId);
                            setSelectedStore(store || null);
                          }}
                        >
                          <option value="">Select Store</option>
                          {storeData.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      
                      {selectedStore && (
                        <div className="mt-2 text-sm">
                          <div><span className="font-medium">City:</span> {selectedStore.city}</div>
                          <div><span className="font-medium">Address:</span> {selectedStore.address}</div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                      <div className="relative">
                        <select 
                          className="w-full border rounded-md px-3 py-2 appearance-none"
                          value={selectedProduct ? selectedProduct.id : ''}
                          onChange={(e) => {
                            const productId = parseInt(e.target.value);
                            const product = productData.find(p => p.id === productId);
                            setSelectedProduct(product || null);
                          }}
                        >
                          <option value="">Select Product</option>
                          {productData.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      
                      {selectedProduct && (
                        <div className="mt-2 text-sm">
                          <div><span className="font-medium">Category:</span> {selectedProduct.category}</div>
                          <div><span className="font-medium">Base Price:</span> ${selectedProduct.price.toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        className="w-full border rounded-md px-3 py-2"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        className="w-full border rounded-md px-3 py-2"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  {formError && (
                    <div className="text-red-500 mb-4">{formError}</div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    {editingInventoryId && (
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 rounded-md"
                        onClick={() => {
                          setEditingInventoryId(null);
                          setSelectedStore(null);
                          setSelectedProduct(null);
                          setQuantity('');
                          setPrice('');
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingInventoryId ? 'Update Item' : 'Save Item'}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Inventory Table */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Current Inventory</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInventory.length > 0 ? (
                        filteredInventory.map((item) => {
                          const store = storeData.find(s => s.id === item.storeId);
                          const product = productData.find(p => p.id === item.productId);
                          
                          return (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                  className="text-blue-600 hover:text-blue-800 mr-3"
                                  onClick={() => handleEditInventory(item.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteInventory(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            {searchTerm ? 'No matching inventory items found' : 'No inventory items available'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {filteredInventory.length > 0 && (
                  <div className="p-4 border-t">
                    <span className="text-sm text-gray-500">
                      Showing {filteredInventory.length} of {inventoryData.length} inventory items
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* History Table */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Action History</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {historyData.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">{item.action}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
