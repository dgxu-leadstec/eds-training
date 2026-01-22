import { LitElement, html } from 'lit';

class DesignSupportCard extends LitElement {
  static properties = {
    title: { type: String },
    description: { type: String },
    links: { type: Array }
  };

  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.links = [];
  }

  // 使用 Light DOM
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="cmp_design-support__card">
        <h3 class="cmp_design-support__title headline-5">${this.title}</h3>
        <p class="cmp_design-support__desc body-2">${this.description}</p>
        
        ${this.links.length > 0 ? html`
          <div class="cmp_design-support__divider"></div>
          <ul class="cmp_design-support__links">
            ${this.links.map(link => html`
              <li>
                <a href="${link.url}" class="headline-6">${link.text}</a>
              </li>
            `)}
          </ul>
        ` : ''}
      </div>
    `;
  }
}

/**
 * 網格容器組件
 */
class DesignSupportGrid extends LitElement {
  static properties = {
    cards: { type: Array }
  };

  constructor() {
    super();
    this.cards = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    // 3 欄佈局，自動分配卡片
    const columns = [[], [], []];
    this.cards.forEach((card, i) => columns[i % 3].push(card));

    return html`
      <div class="cmp_design-support__grid">
        ${columns.map(cards => html`
          <div class="cmp_design-support__column">
            ${cards.map(card => html`
              <design-support-card
                .title=${card.title}
                .description=${card.description}
                .links=${card.links}>
              </design-support-card>
            `)}
          </div>
        `)}
      </div>
    `;
  }
}

// 註冊組件
customElements.define('design-support-card', DesignSupportCard);
customElements.define('design-support-grid', DesignSupportGrid);

/**
 * EDS Block Decorator
 */
export default function decorate(block) {
  // 解析資料
  const cards = [...block.children].map(row => {
    const cells = [...row.children];
    const card = {
      title: cells[0]?.textContent.trim() || '',
      description: cells[1]?.textContent.trim() || '',
      links: []
    };

    // 如果有第 3 欄（連結文字）
    if (cells[2]) {
      const linkTexts = cells[2].textContent.split(',').map(t => t.trim()).filter(Boolean);
      const linkUrls = cells[3] 
        ? cells[3].textContent.split(',').map(u => u.trim()) 
        : linkTexts.map(() => '#');

      linkTexts.forEach((text, i) => {
        card.links.push({ text, url: linkUrls[i] || '#' });
      });
    }

    return card;
  });

  // 建立並渲染組件
  const grid = document.createElement('design-support-grid');
  grid.cards = cards;

  block.textContent = '';
  block.append(grid);
}