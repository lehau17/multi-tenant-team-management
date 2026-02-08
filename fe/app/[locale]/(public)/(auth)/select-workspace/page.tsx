"use client"

import { AuthKeys, Namespaces } from "@/i18n/keys"
import { useTranslations } from "next-intl"
import { Building2, ChevronRight, Plus, CheckCircle2 } from "lucide-react" // Import icon
import { useState } from "react"
import { useRouter } from "next/navigation"

// Mock data thêm chút thông tin cho sinh động
const dummyWorkspaces = [
    { id: 1, name: "One Tech Stop", role: "Owner", avatarColor: "bg-blue-500" },
    { id: 2, name: "Nghiep Phat ERP", role: "Admin", avatarColor: "bg-purple-500" },
    { id: 3, name: "Personal Projects", role: "Member", avatarColor: "bg-emerald-500" }
]

export default function SelectWorkspacePage() {
    const t = useTranslations(Namespaces.Auth)
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [isNavigating, setIsNavigating] = useState(false)

    const handleSelect = (id: number) => {
        setSelectedId(id)
        setIsNavigating(true)
        
        // Giả lập delay chuyển trang để user thấy hiệu ứng loading
        setTimeout(() => {
            router.push(`/dashboard`) // Thay bằng đường dẫn thực tế
        }, 800)
    }

    return (
        // Wrapper căn giữa màn hình, thêm nền nhẹ
        <div className="min-h-screen flex items-center justify-center p-4">
            
            <div className="w-full min-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                {/* Header Section */}
                <div className="pt-8 pb-6 px-8 text-center">
                    <div className="mx-auto bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                        <Building2 size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {t(AuthKeys.selectWorkspace)}
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Chọn không gian làm việc để tiếp tục
                    </p>
                </div>

                {/* List Section */}
                <div className="px-6 pb-6 space-y-3">
                    {dummyWorkspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            onClick={() => handleSelect(workspace.id)}
                            className={`
                                group relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer
                                ${selectedId === workspace.id 
                                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-md" 
                                    : "border-gray-200 hover:border-blue-300 hover:shadow-md hover:bg-white bg-white"
                                }
                                ${isNavigating && selectedId !== workspace.id ? "opacity-50 pointer-events-none" : ""}
                            `}
                        >
                            {/* Avatar tạo từ chữ cái đầu */}
                            <div className={`
                                w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm mr-4 shrink-0
                                ${workspace.avatarColor}
                            `}>
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-base truncate ${selectedId === workspace.id ? "text-blue-700" : "text-gray-900"}`}>
                                    {workspace.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                    {workspace.role}
                                </p>
                            </div>

                            {/* Action Icon (Arrow hoặc Check) */}
                            <div className="ml-2 text-gray-400">
                                {selectedId === workspace.id ? (
                                    <CheckCircle2 className="text-blue-600 animate-in zoom-in duration-300" size={24} />
                                ) : (
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Button tạo mới (Option bổ sung thường có) */}
                    <button className="w-full flex items-center justify-center gap-2 mt-4 p-4 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium">
                        <Plus size={18} />
                        <span>Tạo workspace mới</span>
                    </button>
                </div>

                {/* Footer loading bar (Optional) */}
                {isNavigating && (
                    <div className="h-1 w-full bg-blue-100">
                        <div className="h-full bg-blue-600 animate-[loading_1s_ease-in-out_infinite]" style={{width: '30%'}}></div>
                    </div>
                )}
            </div>
        </div>
    )
}