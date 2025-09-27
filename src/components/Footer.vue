<template>
  <footer class="site-footer">
    <div class="footer-content">      
      <div class="footer-info">
        <p class="license-info">
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" class="license-link">
            CC BY-NC-SA 4.0
          </a>
          2024-2025 © 莹. All rights reserved.
        </p>
        <p class="icp-info">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            冀ICP备2025125921号-1
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer组件，包含CC许可证和ICP备案信息
</script>

<style scoped>
.site-footer {
  margin-top: 60px;
  padding: 40px 0 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.footer-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.footer-links {
  margin-bottom: 20px;
}

.footer-link {
  display: inline-block;
  margin: 0 12px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.25s;
}

.footer-link:hover {
  color: var(--vp-c-brand);
}

.footer-info {
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.6;
}

.license-info {
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.license-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.25s;
}

.license-link:hover {
  color: var(--vp-c-brand-light, var(--vp-c-brand));
  text-decoration: underline;
}

.icp-info {
  margin-bottom: 0;
}

.icp-info a {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.25s;
}

.icp-info a:hover {
  color: var(--vp-c-brand);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .site-footer {
    margin-top: 40px;
    padding: 30px 0 15px;
  }
  
  .footer-content {
    padding: 0 16px;
  }
  
  .footer-link {
    margin: 0 8px;
    font-size: 13px;
  }
  
  .footer-info {
    font-size: 12px;
  }
  
  .license-info {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 0 12px;
  }
  
  .footer-link {
    margin: 0 6px;
    font-size: 12px;
  }
  
  .footer-info {
    font-size: 11px;
  }
  
  .license-info {
    font-size: 12px;
  }
}
</style>
