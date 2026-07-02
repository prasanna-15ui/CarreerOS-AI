"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Shield, User, Ban, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleDisable = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_disabled: !currentStatus })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`User ${!currentStatus ? 'disabled' : 'enabled'} successfully`);
        fetchUsers();
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const promoteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to promote this user to Admin?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`User promoted to admin`);
        fetchUsers();
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const editName = async (id: string, currentName: string) => {
    const newName = prompt("Enter new name:", currentName || "");
    if (newName === null || newName === currentName) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Name updated successfully");
        fetchUsers();
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to update name");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this user profile? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || (filterRole === "admin" && u.role === "admin") || (filterRole === "user" && u.role !== "admin");
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-text-muted">Manage roles and access for all users.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500 w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500 w-full sm:w-48"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-white/70">ID</th>
              <th className="p-4 text-sm font-medium text-white/70">Name</th>
              <th className="p-4 text-sm font-medium text-white/70">Email</th>
              <th className="p-4 text-sm font-medium text-white/70">Role</th>
              <th className="p-4 text-sm font-medium text-white/70">Status</th>
              <th className="p-4 text-sm font-medium text-white/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className={`border-b border-white/10 last:border-0 hover:bg-white/5 ${u.is_disabled ? 'opacity-50' : ''}`}>
                <td className="p-4 text-xs text-white/50 font-mono">{u.id.substring(0, 8)}...</td>
                <td className="p-4 text-sm text-white">{u.name || '-'}</td>
                <td className="p-4 text-sm text-white/80">{u.email || '-'}</td>
                <td className="p-4 text-sm">
                  {u.role === 'admin' ? (
                    <span className="flex items-center gap-1 text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md w-fit text-xs">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md w-fit text-xs">
                      <User className="w-3 h-3" /> User
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm">
                  {u.is_disabled ? (
                    <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded-md w-fit text-xs">Disabled</span>
                  ) : (
                    <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md w-fit text-xs">Active</span>
                  )}
                </td>
                <td className="p-4 text-sm text-right space-x-2 flex justify-end items-center">
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => promoteAdmin(u.id)}
                      className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 bg-purple-400/10 rounded hover:bg-purple-400/20 transition-colors"
                      title="Make Admin"
                    >
                      <Shield className="w-3 h-3" />
                    </button>
                  )}
                  <button 
                    onClick={() => editName(u.id, u.name)}
                    className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 bg-blue-400/10 rounded hover:bg-blue-400/20 transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => toggleDisable(u.id, u.is_disabled)}
                    className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 ${u.is_disabled ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20' : 'text-orange-400 hover:text-orange-300 bg-orange-400/10 hover:bg-orange-400/20'}`}
                    title={u.is_disabled ? 'Enable User' : 'Disable User'}
                  >
                    <Ban className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => deleteUser(u.id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded hover:bg-red-400/20 transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/50">No users found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
