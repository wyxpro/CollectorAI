// 海报生成服务

import { KnowledgeCard } from '../types';
import { CardTheme } from './knowledgeApi';

export interface PosterOptions {
  card: KnowledgeCard;
  theme: CardTheme;
  width?: number;
  height?: number;
  format?: 'png' | 'jpg' | 'webp';
  quality?: number;
  includeQR?: boolean;
}

export class PosterGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  // 生成海报
  async generatePoster(options: PosterOptions): Promise<Blob> {
    const {
      card,
      theme,
      width = 720,
      height = 1280,
      format = 'png',
      quality = 0.95,
      includeQR = true
    } = options;

    // 设置画布大小
    this.canvas.width = width;
    this.canvas.height = height;

    // 清空画布
    this.ctx.clearRect(0, 0, width, height);

    // 绘制背景
    await this.drawBackground(theme, width, height);

    // 绘制头部
    await this.drawHeader(card, theme, width);

    // 绘制内容
    await this.drawContent(card, theme, width, height);

    // 绘制图片
    if (card.articleImage) {
      await this.drawImage(card.articleImage, width, height);
    }

    // 绘制底部
    await this.drawFooter(card, theme, width, height, includeQR);

    // 转换为Blob
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate poster'));
          }
        },
        `image/${format}`,
        quality
      );
    });
  }

  // 绘制背景
  private async drawBackground(theme: CardTheme, width: number, height: number): Promise<void> {
    // 解析渐变背景
    const bgClass = theme.bgClass;
    
    if (bgClass.includes('gradient')) {
      // 创建渐变
      let gradient: CanvasGradient;
      
      if (bgClass.includes('to-br')) {
        gradient = this.ctx.createLinearGradient(0, 0, width, height);
      } else if (bgClass.includes('to-b')) {
        gradient = this.ctx.createLinearGradient(0, 0, 0, height);
      } else {
        gradient = this.ctx.createLinearGradient(0, 0, width, 0);
      }

      // 添加颜色停止点（简化处理）
      if (bgClass.includes('indigo') && bgClass.includes('violet')) {
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#7c3aed');
      } else if (bgClass.includes('slate')) {
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
      } else if (bgClass.includes('rose') && bgClass.includes('amber')) {
        gradient.addColorStop(0, '#fb7185');
        gradient.addColorStop(0.5, '#fdba74');
        gradient.addColorStop(1, '#fcd34d');
      } else {
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#7c3aed');
      }

      this.ctx.fillStyle = gradient;
    } else {
      // 纯色背景
      if (bgClass.includes('slate-900')) {
        this.ctx.fillStyle = '#0f172a';
      } else if (bgClass.includes('fdfbf7')) {
        this.ctx.fillStyle = '#fdfbf7';
      } else {
        this.ctx.fillStyle = '#ffffff';
      }
    }

    // 绘制圆角矩形背景
    this.roundRect(0, 0, width, height, 40);
    this.ctx.fill();
  }

  // 绘制头部
  private async drawHeader(card: KnowledgeCard, theme: CardTheme, width: number): Promise<void> {
    const headerHeight = 280;
    
    // 绘制头部背景（已在drawBackground中完成）
    
    // 绘制Logo和标题
    this.ctx.save();
    this.ctx.fillStyle = this.getTextColor(theme.textClass);
    this.ctx.font = 'bold 18px sans-serif';
    this.ctx.fillText('COLLECTOR + 思维切片', 60, 100);
    
    // 绘制文章标题
    this.ctx.font = 'bold 36px sans-serif';
    this.wrapText(card.articleTitle, 60, 180, width - 120, 50);
    this.ctx.restore();
  }

  // 绘制内容
  private async drawContent(card: KnowledgeCard, theme: CardTheme, width: number, height: number): Promise<void> {
    const contentY = 320;
    const contentPadding = 60;
    
    // 绘制白色内容区域
    this.ctx.fillStyle = '#ffffff';
    this.roundRect(0, contentY, width, height - contentY, 40);
    this.ctx.fill();

    // 绘制引号
    this.ctx.fillStyle = '#e0e7ff';
    this.ctx.font = 'bold 120px serif';
    this.ctx.fillText('"', contentPadding - 20, contentY + 120);

    // 绘制原文内容
    this.ctx.fillStyle = '#1e293b';
    this.ctx.font = 'bold 32px sans-serif';
    this.wrapText(card.originalContent, contentPadding, contentY + 100, width - contentPadding * 2, 48);
  }

  // 绘制图片
  private async drawImage(imageUrl: string, width: number, height: number): Promise<void> {
    try {
      const img = await this.loadImage(imageUrl);
      const imageY = 600;
      const imageHeight = 360;
      const imageWidth = width - 120;
      const imageX = 60;

      // 绘制圆角图片
      this.ctx.save();
      this.roundRect(imageX, imageY, imageWidth, imageHeight, 24);
      this.ctx.clip();
      
      // 计算图片缩放
      const scale = Math.max(imageWidth / img.width, imageHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (imageWidth - scaledWidth) / 2;
      const offsetY = (imageHeight - scaledHeight) / 2;

      this.ctx.drawImage(img, imageX + offsetX, imageY + offsetY, scaledWidth, scaledHeight);
      this.ctx.restore();
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }

  // 绘制底部
  private async drawFooter(
    card: KnowledgeCard,
    theme: CardTheme,
    width: number,
    height: number,
    includeQR: boolean
  ): Promise<void> {
    const footerY = height - 280;

    // 绘制标签
    this.ctx.fillStyle = '#f1f5f9';
    let tagX = 60;
    card.tags.forEach(tag => {
      const tagWidth = this.ctx.measureText(`#${tag}`).width + 40;
      this.roundRect(tagX, footerY, tagWidth, 40, 12);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#64748b';
      this.ctx.font = 'bold 16px sans-serif';
      this.ctx.fillText(`#${tag}`, tagX + 20, footerY + 26);
      
      tagX += tagWidth + 12;
      this.ctx.fillStyle = '#f1f5f9';
    });

    // 绘制Logo
    const logoY = footerY + 80;
    this.ctx.fillStyle = '#4f46e5';
    this.roundRect(60, logoY, 56, 56, 16);
    this.ctx.fill();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px sans-serif';
    this.ctx.fillText('C+', 72, logoY + 38);

    // 绘制品牌信息
    this.ctx.fillStyle = '#1e293b';
    this.ctx.font = 'bold 20px sans-serif';
    this.ctx.fillText('Collector +', 130, logoY + 24);
    
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.fillText('GAMIFIED MASTERY', 130, logoY + 48);

    // 绘制二维码
    if (includeQR) {
      const qrSize = 120;
      const qrX = width - qrSize - 60;
      const qrY = footerY + 60;

      // 绘制二维码背景
      this.ctx.fillStyle = '#ffffff';
      this.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 20);
      this.ctx.fill();

      // 加载并绘制二维码
      try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://readai.app/share/${card.id}&bgcolor=ffffff&color=4f46e5`;
        const qrImg = await this.loadImage(qrUrl);
        this.ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      } catch (error) {
        console.error('Failed to load QR code:', error);
      }

      // 绘制二维码说明
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.font = 'bold 12px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('扫码探索全文', qrX + qrSize / 2, qrY + qrSize + 32);
      this.ctx.textAlign = 'left';
    }
  }

  // 辅助方法：绘制圆角矩形
  private roundRect(x: number, y: number, width: number, height: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  // 辅助方法：文本换行
  private wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split('');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        this.ctx.fillText(line, x, currentY);
        line = words[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, currentY);
  }

  // 辅助方法：加载图片
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  // 辅助方法：获取文本颜色
  private getTextColor(textClass: string): string {
    if (textClass.includes('white')) return '#ffffff';
    if (textClass.includes('slate-800')) return '#1e293b';
    if (textClass.includes('slate-900')) return '#0f172a';
    return '#1e293b';
  }

  // 下载海报
  async downloadPoster(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 获取DataURL
  getDataURL(format: 'png' | 'jpg' | 'webp' = 'png', quality: number = 0.95): string {
    return this.canvas.toDataURL(`image/${format}`, quality);
  }
}

// 导出单例
export const posterGenerator = new PosterGenerator();
