"use client";

import React from "react";
import {
  ShieldAlert,
  Server,
  Users,
  Database,
  RefreshCw,
  Clock,
  Activity,
  HardDrive,
  Cpu,
  Trash2,
} from "lucide-react";
import { useERP } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export const OwnerPanelView: React.FC = () => {
  const {
    auditLogs,
    systemHealth,
    dbSyncInProgress,
    lastSyncTime,
    syncDatabase,
    clearAllDatabaseData,
  } = useERP();

  // Mock staff roles listing
  const erpUsers = [
    { name: "Deepak Zodge", role: "Owner / Director", status: "Admin", access: "Full Control" },
    { name: "Kiran Zodge", role: "Owner / Director", status: "Admin", access: "Full Control" },
    { name: "Harshal Zodge", role: "Owner / Director", status: "Admin", access: "Full Control" },
    { name: "Sanjay Shinde", role: "Site Supervisor", status: "Staff", access: "Bookings + Operations" },
    { name: "Amol Patil", role: "Facility Operator", status: "Staff", access: "Operations + Generator" },
    { name: "Suman Bai", role: "Housekeeper Coordinator", status: "Staff", access: "Checklists Only" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Owner Management Panel
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            System security auditor, node latency statistics, and credential controls
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-700 border border-rose-500/20 rounded-xl text-xs font-bold uppercase tracking-wider">
          <ShieldAlert size={14} /> Owner Mode Secure
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Diagnostics and Sync */}
        <div className="space-y-6">
          {/* Health gauges */}
          <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
            <div className="border-b border-purple-royal/10 pb-3 flex items-center gap-2 text-purple-royal">
              <Server size={16} className="text-gold-luxury" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Ahilyanagar Server Health
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-charcoal-dark/70">
                  <span className="flex items-center gap-1"><Cpu size={12} className="text-gold-luxury" /> CPU core utilization</span>
                  <span>{systemHealth.cpu}%</span>
                </div>
                <div className="w-full bg-purple-royal/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-royal h-full rounded-full transition-all duration-300"
                    style={{ width: `${systemHealth.cpu}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-charcoal-dark/70">
                  <span className="flex items-center gap-1"><Activity size={12} className="text-gold-luxury" /> RAM memory allocation</span>
                  <span>{systemHealth.memory}%</span>
                </div>
                <div className="w-full bg-purple-royal/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-royal h-full rounded-full transition-all duration-300"
                    style={{ width: `${systemHealth.memory}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-charcoal-dark/70">
                  <span className="flex items-center gap-1"><HardDrive size={12} className="text-gold-luxury" /> Local storage backup</span>
                  <span>{systemHealth.disk}%</span>
                </div>
                <div className="w-full bg-purple-royal/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-royal h-full rounded-full transition-all duration-300"
                    style={{ width: `${systemHealth.disk}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px] font-semibold text-charcoal-dark/50">
                <span>API Connection Latency:</span>
                <span className="text-emerald-600 font-bold">{systemHealth.apiLatency} ms (Excellent)</span>
              </div>
            </div>
          </GlassCard>

          {/* Sync operations */}
          <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
            <div className="border-b border-purple-royal/10 pb-3 flex items-center gap-2 text-purple-royal">
              <Database size={16} className="text-gold-luxury" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Database Cloud Backup
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-dark/50 font-semibold">Synchronization Node:</span>
                <span className="font-bold text-purple-royal">ANR-CENTRAL-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-dark/50 font-semibold">Backup Frequency:</span>
                <span className="font-semibold">Hourly Cloud Snapshots</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-dark/50 font-semibold">Last Verified Sync:</span>
                <span className="font-bold text-purple-royal">{lastSyncTime}</span>
              </div>

              <div className="pt-2">
                <GlassButton
                  variant="gold"
                  onClick={syncDatabase}
                  disabled={dbSyncInProgress}
                  className="w-full flex items-center justify-center gap-2 py-2.5"
                >
                  <RefreshCw size={14} className={dbSyncInProgress ? "animate-spin" : ""} />
                  {dbSyncInProgress ? "Synchronizing Cache..." : "Initiate Database Cloud Sync"}
                </GlassButton>
                
                <GlassButton
                  variant="secondary"
                  onClick={async () => {
                    if (confirm("Are you sure you want to clear all local cache and delete all database client/booking records? This cannot be undone.")) {
                      await clearAllDatabaseData();
                      window.location.href = "/";
                    }
                  }}
                  className="w-full mt-2 border-rose-200 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 py-2.5 flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Clear & Reset All Databases
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Columns: Security audits and user list */}
        <div className="lg:col-span-2 space-y-6">
          {/* User management roles */}
          <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
            <div className="border-b border-purple-royal/10 pb-3 flex items-center gap-2 text-purple-royal">
              <Users size={16} className="text-gold-luxury" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Credential Accounts & Node Authorization
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-purple-royal/15 font-bold text-purple-royal/80 pb-2">
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Facility Role</th>
                    <th className="py-2.5">Level</th>
                    <th className="py-2.5">Permissions Granted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-royal/5">
                  {erpUsers.map((usr, i) => (
                    <tr key={i} className="hover:bg-purple-royal/[0.02]">
                      <td className="py-3 font-bold text-purple-royal">{usr.name}</td>
                      <td className="py-3 font-semibold">{usr.role}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          usr.status === "Admin"
                            ? "bg-gold-luxury/10 text-gold-dark border-gold-luxury/20"
                            : "bg-purple-royal/5 text-purple-royal border-purple-royal/10"
                        }`}>
                          {usr.status}
                        </span>
                      </td>
                      <td className="py-3 text-charcoal-dark/60 font-semibold">{usr.access}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Audit trail */}
          <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
            <div className="border-b border-purple-royal/10 pb-3 flex items-center gap-2 text-purple-royal">
              <Clock size={16} className="text-gold-luxury" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Audit Trail Security Logs
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-purple-royal/15 font-bold text-purple-royal/80 pb-2">
                    <th className="py-2.5">Timestamp</th>
                    <th className="py-2.5">User Handle</th>
                    <th className="py-2.5">Action Executed</th>
                    <th className="py-2.5">Node IP</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-royal/5 font-medium">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-purple-royal/[0.02]">
                      <td className="py-3 text-charcoal-dark/50">
                        {new Date(log.timestamp).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 font-bold text-purple-royal">{log.user}</td>
                      <td className="py-3 text-charcoal-dark/80">{log.action}</td>
                      <td className="py-3 text-charcoal-dark/50">{log.ipAddress}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border inline-block ${
                          log.status === "Success"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default OwnerPanelView;
