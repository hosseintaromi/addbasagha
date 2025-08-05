'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const folders = [
    { id: 1, name: "New Folder", count: 0, color: "bg-blue-500" },
];

const projects = [
    { id: 1, title: "videoplayback", thumb: "/placeholder-thumb.png", updated: "30 minutes ago", duration: "0:31" },
    { id: 2, title: "abbasaghaa test v1", thumb: "/placeholder-thumb.png", updated: "an hour ago", duration: "0:31" },
];

export default function DashboardPage() {
    const { t, isRTL } = useLanguage()
    const [showCreateDropdown, setShowCreateDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">ABBASAGHA</span>
                        </div>

                        <nav className={`hidden md:flex items-center gap-6 ${isRTL ? 'mr-8' : 'ml-8'}`}>
                            <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Templates</a>
                            <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Tools</a>
                            <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Resources</a>
                        </nav>
                    </div>

                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <LanguageToggle />
                        <ThemeToggle />
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
                            {t('dashboard.upgrade')}
                        </button>
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {/* Breadcrumb and Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('dashboard.home')}</span>
                        <span className="text-gray-400 dark:text-gray-500">/</span>
                        <span className="font-medium text-gray-900 dark:text-white">{t('dashboard.newFolder')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.dateCreated')}</span>
                            <button className="text-gray-400 dark:text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
                            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                            <button className="px-3 py-1 text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6v6H9V4zM9 14h6v6H9v-6zM3 4h6v6H3V4zM3 14h6v6H3v-6z" />
                                </svg>
                            </button>
                        </div>

                        {/* Create New Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                                className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {t('dashboard.createNew')}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showCreateDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                    <div className="py-1">
                                        <Link
                                            href="/create"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                                                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <span>{t('dashboard.repurpose')}</span>
                                        </Link>
                                        <Link
                                            href="/create"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded flex items-center justify-center">
                                                <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                </svg>
                                            </div>
                                            <span>{t('dashboard.translate')}</span>
                                        </Link>
                                        <Link
                                            href="/create"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <span>{t('dashboard.generate')}</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Folders */}
                    {folders.map((folder) => (
                        <div key={folder.id} className="group cursor-pointer">
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center mb-2 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-colors">
                                <div className="text-center">
                                    <div className={`w-12 h-12 ${folder.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{folder.count} {t('dashboard.items')}</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{folder.name}</p>
                        </div>
                    ))}

                    {/* Projects */}
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/timeline?id=${project.id}`}
                            className="group cursor-pointer"
                        >
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-2 relative group-hover:shadow-md transition-shadow">
                                <Image
                                    src={project.thumb}
                                    fill
                                    alt={project.title}
                                    className="object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                    {project.duration}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{project.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{project.updated}</p>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {projects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.noProjectsYet')}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{t('dashboard.getStartedFirst')}</p>
                        <button
                            onClick={() => setShowCreateDropdown(true)}
                            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                            {t('dashboard.createNewProject')}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}