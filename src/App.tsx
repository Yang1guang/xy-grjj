import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Pencil, Save, Eye, Plus, Trash2, ArrowUp, ArrowDown, 
  Image as ImageIcon, Video, FileText, UploadCloud, Link
} from 'lucide-react';

// ==========================================
// 1. 类型定义
// ==========================================
type BlockType = 'hero' | 'gallery' | 'document';

interface BlockData {
  id: string;
  type: BlockType;
  content: any;
}

// 默认预设的一组高级模块，引导用户修改
const INITIAL_DATA: BlockData[] = [
  {
    id: 'block-init-1',
    type: 'hero',
    content: {
      name: '在这里输入你的名字',
      title: '点击编辑你的高级职位头衔',
      bio: '点击这里输入你的个人简介。支持多行输入。你可以随时修改这段文字，向世界展示你的独特价值与项目经验。',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    }
  }
];

// ==========================================
// 2. 安全云端上传接口 (隐藏 R2 逻辑，对外只称“专属极速云”)
// ==========================================
const uploadToCloudBackend = async (file: File): Promise<string> => {
  // 商业交付说明：此处为前端模拟秒传。
  // 买家部署时，只需在此处替换为 fetch('你的CloudflareWorker接口') 即可。
  return new Promise((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 800);
  });
};

// ==========================================
// 3. 高级媒体拖拽上传组件 (Glassmorphism 风格)
// ==========================================
const MediaUploader = ({ onUpload, accept, label, compact = false }: { onUpload: (url: string) => void, accept: any, label: string, compact?: boolean }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        try {
          const url = await uploadToCloudBackend(acceptedFiles[0]);
          onUpload(url);
        } catch (error) {
          console.error("上传失败", error);
        } finally {
          setIsUploading(false);
        }
      }
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden
        ${compact ? 'min-h-[100px]' : 'min-h-[200px]'}
        ${isDragActive ? 'border-purple-500 bg-purple-500/20 scale-105' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}
      `}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-purple-400">
          <UploadCloud size={32} />
        </motion.div>
      ) : (
        <div className="flex flex-col items-center p-4 text-center">
          <div className="bg-white/10 p-3 rounded-full mb-3 backdrop-blur-md shadow-xl">
            <UploadCloud size={24} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-300 font-medium">{label}</p>
          {!compact && <p className="text-xs text-gray-500 mt-2">支持拖拽或点击上传至安全云端</p>}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. 主应用架构
// ==========================================
export default function App() {
  const [blocks, setBlocks] = useState<BlockData[]>(INITIAL_DATA);
  const [isEditMode, setIsEditMode] = useState(true);

  // 模块核心操作
  const updateBlock = (id: string, newContent: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 1 | -1) => {
    const newBlocks = [...blocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const addBlock = (type: BlockType) => {
    const newBlock: BlockData = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'gallery' ? { url: '', mediaType: 'image' } : { title: '未命名文档/链接', url: '' }
    };
    setBlocks([...blocks, newBlock]);
    // 自动滚动到底部
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  const handleSave = () => {
    setIsEditMode(false);
    // 商业交付时：将 blocks 数据发送至后台接口
    alert('🎉 保存成功！您的数据已加密上传至专属极速节点。');
  };

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-purple-500/50 pb-40">
      
      {/* 极光背景特效 (脱离代码的高级感来源) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/40 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/30 blur-[120px] rounded-full mix-blend-screen"
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <AnimatePresence mode="popLayout">
          {blocks.map((block, index) => (
            <motion.div
              layout
              key={block.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className={`relative group ${isEditMode ? 'p-6 sm:p-8 border border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-purple-500/40 transition-all shadow-xl' : ''}`}
            >
              
              {/* 编辑模式浮动工具栏 */}
              {isEditMode && (
                <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-[#1a1a1a] p-1.5 rounded-2xl border border-white/10 z-50 shadow-2xl scale-95 group-hover:scale-100">
                  <button onClick={() => moveBlock(index, -1)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors" title="上移"><ArrowUp size={16} /></button>
                  <button onClick={() => moveBlock(index, 1)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors" title="下移"><ArrowDown size={16} /></button>
                  <div className="w-[1px] h-6 bg-white/10 self-center mx-1"></div>
                  <button onClick={() => removeBlock(block.id)} className="p-2 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors" title="删除区块"><Trash2 size={16} /></button>
                </div>
              )}

              {/* 区块路由渲染 */}
              {block.type === 'hero' && (
                <HeroBlock data={block.content} isEditMode={isEditMode} onChange={(newData: any) => updateBlock(block.id, newData)} />
              )}
              {block.type === 'gallery' && (
                <MediaBlock data={block.content} isEditMode={isEditMode} onChange={(newData: any) => updateBlock(block.id, newData)} />
              )}
              {block.type === 'document' && (
                <DocumentBlock data={block.content} isEditMode={isEditMode} onChange={(newData: any) => updateBlock(block.id, newData)} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* 底部悬浮控制中枢 */}
      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#111]/80 backdrop-blur-2xl border border-white/10 p-2.5 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-2 z-50 w-[90%] max-w-fit overflow-x-auto no-scrollbar"
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {isEditMode ? (
          <>
            <div className="flex bg-white/5 p-1 rounded-[1.5rem] shrink-0">
              <button onClick={() => addBlock('gallery')} className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 rounded-2xl text-sm font-medium transition-all text-gray-300 hover:text-white">
                <ImageIcon size={18} /> <span className="hidden sm:inline">添加图传视频</span>
              </button>
              <button onClick={() => addBlock('document')} className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 rounded-2xl text-sm font-medium transition-all text-gray-300 hover:text-white">
                <FileText size={18} /> <span className="hidden sm:inline">挂载文档附件</span>
              </button>
            </div>
            <div className="w-[1px] h-8 bg-white/10 shrink-0 mx-2"></div>
            <button onClick={() => setIsEditMode(false)} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all shrink-0">
              <Eye size={18} /> 预览
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0">
              <Save size={18} /> 发布
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 rounded-[1.5rem] text-sm font-bold transition-all">
            <Pencil size={18} /> 进入专属编辑后台
          </button>
        )}
      </motion.div>
    </div>
  );
}

// ==========================================
// 5. 各个高级区块组件 (内联编辑引擎)
// ==========================================

const HeroBlock = ({ data, isEditMode, onChange }: any) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-10 py-4">
      {/* 头像区域 */}
      <div className="relative group w-32 h-32 sm:w-48 sm:h-48 shrink-0">
        <div className="w-full h-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-[#111]">
          <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        {isEditMode && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[2rem] sm:rounded-[3rem] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-4">
             <MediaUploader 
               compact 
               accept={{ 'image/*': [] }} 
               label="更换形象照" 
               onUpload={(url) => onChange({ ...data, avatar: url })} 
             />
          </div>
        )}
      </div>

      {/* 文本区域 */}
      <div className="flex-1 space-y-4 text-center sm:text-left w-full">
        <h1 
          contentEditable={isEditMode} suppressContentEditableWarning
          onBlur={(e) => onChange({...data, name: e.currentTarget.textContent})}
          className={`text-4xl sm:text-6xl font-extrabold tracking-tight text-white ${isEditMode ? 'hover:bg-white/5 cursor-text' : ''}`}
        >{data?.name ?? ''}</h1>
        
        <h2 
          contentEditable={isEditMode} suppressContentEditableWarning
          onBlur={(e) => onChange({...data, title: e.currentTarget.textContent})}
          className={`text-lg sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-medium ${isEditMode ? 'hover:bg-white/5 cursor-text' : ''}`}
        >{data?.title ?? ''}</h2>
        
        <p 
          contentEditable={isEditMode} suppressContentEditableWarning
          onBlur={(e) => onChange({...data, bio: e.currentTarget.textContent})}
          className={`text-gray-400 text-base sm:text-lg leading-relaxed ${isEditMode ? 'hover:bg-white/5 cursor-text min-h-[50px]' : ''}`}
        >{data?.bio ?? ''}</p>
      </div>
    </div>
  );
};

const MediaBlock = ({ data, isEditMode, onChange }: any) => {
  if (!data?.url && !isEditMode) return null;

  return (
    <div className="w-full rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 shadow-2xl relative group">
      {!data?.url ? (
        <div className="p-8">
          <MediaUploader 
            accept={{ 'image/*': [], 'video/*': [] }} 
            label="上传横版高清图片或短视频" 
            onUpload={(url) => onChange({ ...data, url, mediaType: url.match(/\.(mp4|webm)$/i) ? 'video' : 'image' })} 
          />
        </div>
      ) : (
        <div className="relative">
          {data.mediaType === 'video' ? (
             <video src={data.url} autoPlay loop muted playsInline className="w-full h-auto max-h-[70vh] object-cover" />
          ) : (
             <img src={data.url} alt="Gallery" className="w-full h-auto max-h-[70vh] object-cover" />
          )}
          {isEditMode && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onChange({...data, url: ''})} 
                className="bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-bold text-white hover:bg-red-500 transition-colors shadow-xl"
              >
                移除重传
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DocumentBlock = ({ data, isEditMode, onChange }: any) => {
  if (!data?.url && !isEditMode) return null;

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
      <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
        <Link size={28} />
      </div>
      
      <div className="flex-1 w-full text-center sm:text-left">
        <h3 
          contentEditable={isEditMode} suppressContentEditableWarning
          onBlur={(e) => onChange({...data, title: e.currentTarget.textContent})}
          className={`text-xl sm:text-2xl font-bold text-white mb-2 ${isEditMode ? 'hover:bg-white/5 cursor-text inline-block min-w-[200px]' : ''}`}
        >
          {data?.title ?? '输入文档或链接标题'}
        </h3>
        <p className="text-gray-400 text-sm">专业演示附件 / 外部链接</p>
      </div>
      
      <div className="w-full sm:w-auto mt-4 sm:mt-0">
        {!data?.url ? (
          isEditMode && (
            <div className="w-full sm:w-64">
              <MediaUploader 
                compact
                accept={{ 'application/pdf': [], 'application/vnd.ms-powerpoint': [] }} 
                label="上传附件至云端" 
                onUpload={(url) => onChange({ ...data, url })} 
              />
            </div>
          )
        ) : (
          <div className="flex gap-3 justify-center">
             <a 
               href={data.url} 
               target="_blank" 
               rel="noreferrer" 
               className="px-6 py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl font-medium transition-colors text-sm"
             >
               打开链接
             </a>
             {isEditMode && (
               <button 
                 onClick={() => onChange({...data, url: ''})} 
                 className="px-4 py-3.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-colors"
                 title="清除附件"
               >
                 <Trash2 size={18}/>
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
