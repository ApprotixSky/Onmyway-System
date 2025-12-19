import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useFiles, useFileContent } from "@/hooks/use-files";
import { Folder, FileText, ChevronRight, Home, Download, FileCode, FileImage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { data: files, isLoading } = useFiles(currentPath);
  const { data: fileContent } = useFileContent(selectedFile);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const handleUp = () => {
    if (currentPath === "/") return;
    const parent = currentPath.split("/").slice(0, -1).join("/") || "/";
    handleNavigate(parent);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-4 md:p-8 pb-24 md:pb-8 h-screen overflow-hidden flex flex-col">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">FILE SYSTEM</h2>
            <div className="flex items-center gap-2 mt-2 text-sm font-mono text-muted-foreground bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
              <Home size={14} className="cursor-pointer hover:text-primary" onClick={() => handleNavigate("/")} />
              <span className="text-white/20">/</span>
              <span>{currentPath}</span>
            </div>
          </div>
          <button 
            onClick={handleUp}
            disabled={currentPath === "/"}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Up Level
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* File List */}
          <div className="lg:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading file system...</div>
              ) : (
                <div className="space-y-1">
                  {files?.map((file) => (
                    <motion.div
                      key={file.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => file.isDirectory ? handleNavigate(file.path) : setSelectedFile(file.path)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group border border-transparent",
                        selectedFile === file.path 
                          ? "bg-primary/10 border-primary/20" 
                          : "hover:bg-white/5 hover:border-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          file.isDirectory ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-muted-foreground group-hover:text-foreground"
                        )}>
                          {file.isDirectory ? <Folder size={18} /> : <FileText size={18} />}
                        </div>
                        <div>
                          <p className={cn("font-medium text-sm", selectedFile === file.path ? "text-primary" : "text-foreground")}>
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {file.permissions} • {file.lastModified}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-muted-foreground">{formatSize(file.size)}</span>
                        {file.isDirectory && <ChevronRight size={16} className="text-muted-foreground" />}
                      </div>
                    </motion.div>
                  ))}
                  {files?.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">Directory is empty</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-2xl border border-white/5 p-6 flex flex-col overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <FileCode size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate" title={selectedFile}>{selectedFile.split('/').pop()}</h3>
                    <p className="text-xs text-muted-foreground">Preview Mode</p>
                  </div>
                </div>
                
                <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-xs overflow-auto border border-white/5 text-muted-foreground">
                  {fileContent ? (
                    <pre className="whitespace-pre-wrap break-all">
                      {fileContent.content.slice(0, 1000)}
                      {fileContent.content.length > 1000 && "\n... (File truncated)"}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full">Loading content...</div>
                  )}
                </div>
                
                <div className="mt-6">
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium">
                    <Download size={16} />
                    Download File
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl border border-white/5 flex items-center justify-center text-muted-foreground p-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileImage size={24} className="opacity-50" />
                  </div>
                  <p>Select a file to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
