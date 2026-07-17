"use client";

import React, { useState } from "react";
import {
  Sliders,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  Fuel,
  IndianRupee,
  Activity,
} from "lucide-react";
import { useERP, KanbanTask, TaskStatus, TaskPriority } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";

export const OperationsView: React.FC = () => {
  const {
    kanbanTasks,
    generatorFuelLevel,
    generatorRuntimeHours,
    generatorLogs,
    updateTaskStatus,
    addNewTask,
    addGeneratorLog,
  } = useERP();

  // New task form
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCat, setTaskCat] = useState("Decor");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("Medium");
  const [showAddTask, setShowAddTask] = useState(false);

  // Generator Log form
  const [litresAdded, setLitresAdded] = useState("");
  const [costPerLitre, setCostPerLitre] = useState("98.50");
  const [runtimeHoursAdded, setRuntimeHoursAdded] = useState("");
  const [showGenLogForm, setShowGenLogForm] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle && taskAssignee && taskDesc) {
      addNewTask({
        title: taskTitle,
        category: taskCat,
        assignee: taskAssignee,
        description: taskDesc,
        status: "Todo",
        priority: taskPriority,
      });
      setTaskTitle("");
      setTaskAssignee("");
      setTaskDesc("");
      setShowAddTask(false);
    }
  };

  const handleCreateGenLog = (e: React.FormEvent) => {
    e.preventDefault();
    const litres = Number(litresAdded) || 0;
    const cost = Number(costPerLitre) || 0;
    const hours = Number(runtimeHoursAdded) || 0;
    
    if (litres > 0 || hours > 0) {
      addGeneratorLog(litres, cost, hours);
      setLitresAdded("");
      setRuntimeHoursAdded("");
      setShowGenLogForm(false);
    }
  };

  // Columns filter
  const getTasksByStatus = (status: TaskStatus) => {
    return kanbanTasks.filter((t) => t.status === status);
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case "High":
        return "bg-rose-500/10 text-rose-700 border-rose-500/10";
      case "Medium":
        return "bg-amber-500/10 text-amber-700 border-amber-500/10";
      case "Low":
        return "bg-gray-500/10 text-gray-700 border-gray-500/10";
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Operations & Utility Command
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            Kanban checklists, generator operations and facility logging
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GlassButton variant="secondary" onClick={() => setShowGenLogForm(!showGenLogForm)}>
            <Fuel size={15} /> Log Generator Ops
          </GlassButton>
          <GlassButton variant="gold" onClick={() => setShowAddTask(!showAddTask)}>
            <Plus size={15} /> Add Task
          </GlassButton>
        </div>
      </div>

      {/* Interactive Forms Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* ADD TASK PANEL */}
        {showAddTask && (
          <GlassCard className="p-6 border-white/60 bg-white/40 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-2 mb-4">
              Add Operational Checklist Item
            </h3>
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Task Title"
                placeholder="e.g. Set up stage spotlights"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
              <GlassInput
                label="Assignee Staff Member"
                placeholder="e.g. Satish More"
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                required
              />
              <GlassSelect
                label="Task Category"
                options={[
                  { value: "Decor", label: "Decorations" },
                  { value: "Audio", label: "Sound & Audio" },
                  { value: "Kitchen", label: "Kitchen & Catering" },
                  { value: "Operations", label: "Operations & Safety" },
                  { value: "Housekeeping", label: "Housekeeping / Clean" },
                ]}
                value={taskCat}
                onChange={(e) => setTaskCat(e.target.value)}
              />
              <GlassSelect
                label="Priority"
                options={[
                  { value: "Low", label: "Low Priority" },
                  { value: "Medium", label: "Medium Priority" },
                  { value: "High", label: "High Priority" },
                ]}
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
              />
              <div className="sm:col-span-2">
                <GlassInput
                  label="Description / Instructions"
                  placeholder="Details of instructions for the staff member"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-purple-royal/10">
                <GlassButton
                  variant="secondary"
                  type="button"
                  onClick={() => setShowAddTask(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton variant="gold" type="submit">
                  Log Task
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        )}

        {/* LOG GENERATOR PANEL */}
        {showGenLogForm && (
          <GlassCard className="p-6 border-white/60 bg-white/40 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-2 mb-4">
              Log Backup Generator Operation
            </h3>
            <form onSubmit={handleCreateGenLog} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Diesel Refilled (Litres)"
                type="number"
                placeholder="e.g. 150 (Leave 0 if none)"
                value={litresAdded}
                onChange={(e) => setLitresAdded(e.target.value)}
              />
              <GlassInput
                label="Diesel Rate (₹/Litre)"
                type="number"
                step="0.01"
                placeholder="e.g. 98.50"
                value={costPerLitre}
                onChange={(e) => setCostPerLitre(e.target.value)}
              />
              <div className="sm:col-span-2">
                <GlassInput
                  label="Runtime Hours Added (Hrs)"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 5.5 (Hours generator ran during power cut)"
                  value={runtimeHoursAdded}
                  onChange={(e) => setRuntimeHoursAdded(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-purple-royal/10">
                <GlassButton
                  variant="secondary"
                  type="button"
                  onClick={() => setShowGenLogForm(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton variant="gold" type="submit">
                  Log Entry
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO COLUMN */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-royal px-1 flex items-center justify-between">
            <span>To Do Checklist</span>
            <span className="w-5 h-5 rounded-full bg-purple-royal/10 text-purple-royal flex items-center justify-center text-[10px]">
              {getTasksByStatus("Todo").length}
            </span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {getTasksByStatus("Todo").map((t) => (
              <GlassCard key={t.id} className="p-4 border-white/60 bg-white/40 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-purple-royal/60 bg-purple-royal/5 px-2 py-0.5 rounded uppercase">
                    {t.category}
                  </span>
                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${getPriorityColor(t.priority)}`}>
                    {t.priority}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-charcoal-dark leading-snug">{t.title}</h4>
                  <p className="text-[10px] text-charcoal-dark/50 mt-1">{t.description}</p>
                </div>
                <div className="flex justify-between items-center border-t border-purple-royal/5 pt-2 text-[10px] text-charcoal-dark/60 font-semibold">
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-gold-luxury" /> {t.assignee}
                  </span>
                  <button
                    onClick={() => updateTaskStatus(t.id, "In Progress")}
                    className="flex items-center gap-0.5 text-purple-royal hover:text-gold-luxury cursor-pointer font-bold"
                  >
                    Start <ArrowRight size={12} />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-royal px-1 flex items-center justify-between">
            <span>In Progress</span>
            <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center text-[10px]">
              {getTasksByStatus("In Progress").length}
            </span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {getTasksByStatus("In Progress").map((t) => (
              <GlassCard key={t.id} className="p-4 border-white/60 bg-white/40 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-purple-royal/60 bg-purple-royal/5 px-2 py-0.5 rounded uppercase">
                    {t.category}
                  </span>
                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${getPriorityColor(t.priority)}`}>
                    {t.priority}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-charcoal-dark leading-snug">{t.title}</h4>
                  <p className="text-[10px] text-charcoal-dark/50 mt-1">{t.description}</p>
                </div>
                <div className="flex justify-between items-center border-t border-purple-royal/5 pt-2 text-[10px] text-charcoal-dark/60 font-semibold">
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-gold-luxury" /> {t.assignee}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateTaskStatus(t.id, "Todo")}
                      className="text-charcoal-dark/40 hover:text-charcoal-dark cursor-pointer font-bold flex items-center"
                    >
                      <ArrowLeft size={12} />
                    </button>
                    <button
                      onClick={() => updateTaskStatus(t.id, "Completed")}
                      className="flex items-center gap-0.5 text-emerald-600 hover:text-emerald-800 cursor-pointer font-bold"
                    >
                      Done <CheckCircle size={12} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* COMPLETED COLUMN */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-royal px-1 flex items-center justify-between">
            <span>Completed Checklist</span>
            <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-[10px]">
              {getTasksByStatus("Completed").length}
            </span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {getTasksByStatus("Completed").map((t) => (
              <GlassCard key={t.id} className="p-4 border-white/60 bg-white/40 space-y-3 relative opacity-75">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-purple-royal/60 bg-purple-royal/5 px-2 py-0.5 rounded uppercase">
                    {t.category}
                  </span>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 uppercase">
                    Completed
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-charcoal-dark leading-snug line-through">{t.title}</h4>
                  <p className="text-[10px] text-charcoal-dark/40 mt-1">{t.description}</p>
                </div>
                <div className="flex justify-between items-center border-t border-purple-royal/5 pt-2 text-[10px] text-charcoal-dark/60 font-semibold">
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-gold-luxury" /> {t.assignee}
                  </span>
                  <button
                    onClick={() => updateTaskStatus(t.id, "In Progress")}
                    className="text-purple-royal hover:text-gold-luxury cursor-pointer font-bold flex items-center gap-0.5"
                  >
                    <ArrowLeft size={12} /> Reopen
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Generator logs and diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator stats widget */}
        <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-royal/5 pb-3">
            <Activity className="text-gold-luxury w-4.5 h-4.5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Generator Diagnostics
            </h4>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between">
              <span className="text-charcoal-dark/50">Capacity Rating:</span>
              <span className="font-bold text-purple-royal">125 KVA Silent Diesel Generator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-dark/50">Current Fuel Capacity:</span>
              <span className={`font-bold ${generatorFuelLevel < 35 ? "text-rose-600 animate-pulse" : "text-emerald-600"}`}>
                {generatorFuelLevel}% ({generatorFuelLevel * 5} Litres remaining)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-dark/50">Total Operational Runtime:</span>
              <span className="font-bold text-purple-royal">{generatorRuntimeHours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-dark/50">Fuel Consumption Rate:</span>
              <span className="font-semibold">~15 Litres/Hour at peak load</span>
            </div>
            <div className="p-3 bg-purple-royal/5 border border-purple-royal/10 rounded-xl flex items-start gap-2">
              <AlertCircle className="text-purple-royal w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-[10px] text-charcoal-dark/60 leading-normal">
                Generator is scheduled for monthly service inspection after 500 operating hours. Currently at {generatorRuntimeHours} Hours.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Generator logs table */}
        <GlassCard className="lg:col-span-2 p-6 border-white/60 bg-white/40 space-y-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Generator Operation History Logs
            </h4>
            <p className="text-[10px] text-charcoal-dark/50">
              Fuel refill events, running log durations, and cost checks
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-royal/15 font-bold text-purple-royal/80 pb-2">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5 text-center">Refill Litres</th>
                  <th className="py-2.5 text-right">Fuel Cost</th>
                  <th className="py-2.5 text-center">Ran duration</th>
                  <th className="py-2.5 text-center">Fuel CapacityAfter</th>
                  <th className="py-2.5">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-royal/5">
                {generatorLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-purple-royal/[0.02]">
                    <td className="py-3 text-charcoal-dark/60">{log.date}</td>
                    <td className="py-3 text-center font-bold">{log.dieselAddedLitres > 0 ? `+${log.dieselAddedLitres} L` : "-"}</td>
                    <td className="py-3 text-right text-rose-600 font-semibold">
                      {log.totalCost > 0 ? `₹${log.totalCost.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="py-3 text-center font-semibold text-purple-royal">
                      {log.runHoursAdded > 0 ? `+${log.runHoursAdded} Hrs` : "-"}
                    </td>
                    <td className="py-3 text-center font-bold text-charcoal-dark/70">{log.fuelLevelAfter}%</td>
                    <td className="py-3 text-charcoal-dark/50">{log.loggedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default OperationsView;
