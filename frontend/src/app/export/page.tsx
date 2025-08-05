'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ExportPage() {
    const { t } = useLanguage()
    const [selectedFormat, setSelectedFormat] = useState('Video')
    const [fileFormat, setFileFormat] = useState('MP4')
    const [resolution, setResolution] = useState('608 x 1080')
    const [compression, setCompression] = useState(50)
    const [isExporting, setIsExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)
    const [exportComplete, setExportComplete] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

    const formats = ['Video', 'Image', 'Audio', 'GIF']
    const videoFormats = ['MP4', 'WEBM', 'MOV']
    const resolutions = ['AUTO', '608 x 1080', '720p', '1080p', '4K']

    const estimatedSize = compression > 70 ? '5.2 MB – 12.1 MB' :
        compression > 40 ? '2.3 MB – 9.1 MB' :
            '1.1 MB – 4.5 MB'

    const handleExport = async () => {
        setIsExporting(true)
        setExportProgress(0)

        // Simulate export progress
        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsExporting(false)
                    setExportComplete(true)
                    setDownloadUrl('/sample-export.mp4') // Mock download URL
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 200)
    }

    const handleDownload = () => {
        if (downloadUrl) {
            const a = document.createElement('a')
            a.href = downloadUrl
            a.download = `video-export.${fileFormat.toLowerCase()}`
            a.click()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/timeline" className="text-gray-600 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">ABBASAGHA</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                            UPGRADE
                        </button>
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </header>

            <main className="flex flex-col items-center p-6">
                <div className="w-full max-w-lg">
                    {/* Video Preview */}
                    <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
                        <div className="text-white text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-300">Video Preview</p>
                        </div>
                    </div>

                    {/* Export Settings */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border space-y-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{t('export.title')}</h1>

                        {/* Format Tabs */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('export.type')}</label>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                {formats.map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setSelectedFormat(format)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${selectedFormat === format
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {format}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Format */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('export.format')}</label>
                                <select
                                    value={fileFormat}
                                    onChange={(e) => setFileFormat(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {videoFormats.map(format => (
                                        <option key={format} value={format}>{format}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Resolution */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('export.resolution')}</label>
                                <select
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {resolutions.map(res => (
                                        <option key={res} value={res}>{res}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Compression Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('export.compressionLevel')}</label>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>{t('export.smallerFile')}</span>
                                    <span>{t('export.higherQuality')}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={compression}
                                    onChange={(e) => setCompression(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 text-center">
                                    Adjusts file size without changing resolution
                                </p>
                            </div>
                        </div>

                        {/* File Size Estimate */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{t('export.estimatedSize')}:</p>
                            <p className="text-lg font-semibold text-gray-900">{estimatedSize}</p>
                        </div>

                        {/* Export Progress */}
                        {isExporting && (
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">{t('export.exporting')}</span>
                                    <span className="font-medium">{Math.round(exportProgress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-cyan-500 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${exportProgress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                    {t('export.complete')}
                                </p>
                            </div>
                        )}

                        {/* Export Complete */}
                        {exportComplete && (
                            <div className="text-center space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-900">{t('export.complete')}</h3>
                                    <p className="text-sm text-green-700">{t('export.ready')}</p>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                >
                                    {t('export.download')}
                                </button>
                            </div>
                        )}

                        {/* Export Button */}
                        {!isExporting && !exportComplete && (
                            <button
                                onClick={handleExport}
                                className="w-full h-12 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                                </svg>
                                Export as {fileFormat}
                            </button>
                        )}

                        {/* Watermark Notice */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800">
                                Upgrade to export without the Abbasagha watermark on your projects
                            </p>
                            <button className="mt-2 text-sm font-medium text-orange-600 hover:underline">
                                Upgrade →
                            </button>
                        </div>

                        {/* Recent Exports */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">RECENT EXPORTS</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-6 bg-gray-300 rounded"></div>
                                        <div>
                                            <p className="text-sm font-medium">video_export_1.mp4</p>
                                            <p className="text-xs text-gray-500">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 text-sm font-medium hover:underline">
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
