// Reusable Modal Component
import { createElement } from '../utils.js';

export class Modal {
  constructor(options = {}) {
    this.title = options.title || '';
    this.content = options.content || '';
    this.actions = options.actions || [];
    this.size = options.size || 'medium'; // small, medium, large
    this.onClose = options.onClose || null;
    this.closeOnOverlay = options.closeOnOverlay !== false;
    this.element = null;
    this.isOpen = false;
  }

  render() {
    const modal = createElement('div', 'modal-overlay');
    modal.setAttribute('data-testid', 'modal-overlay');

    if (this.closeOnOverlay) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.close();
        }
      });
    }

    const modalContent = createElement(
      'div',
      `modal-content modal-${this.size}`
    );
    modalContent.setAttribute('data-testid', 'modal-content');

    const modalHeader = createElement('div', 'modal-header');
    const modalTitle = createElement('h2', 'modal-title', this.title);
    modalTitle.setAttribute('data-testid', 'modal-title');

    const closeButton = createElement('button', 'modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.setAttribute('data-testid', 'modal-close-btn');
    closeButton.addEventListener('click', () => this.close());

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = createElement('div', 'modal-body');
    modalBody.setAttribute('data-testid', 'modal-body');

    if (typeof this.content === 'string') {
      modalBody.innerHTML = this.content;
    } else if (this.content instanceof HTMLElement) {
      modalBody.appendChild(this.content);
    }

    const modalFooter = createElement('div', 'modal-footer');
    modalFooter.setAttribute('data-testid', 'modal-footer');

    this.actions.forEach((action, index) => {
      const button = createElement(
        'button',
        `btn ${action.className || 'btn-primary'}`
      );
      button.textContent = action.label;
      button.setAttribute('data-testid', `modal-action-${index}`);

      if (action.onClick) {
        button.addEventListener('click', () => {
          action.onClick(this);
        });
      }

      if (action.disabled) {
        button.disabled = true;
      }

      modalFooter.appendChild(button);
    });

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    if (this.actions.length > 0) {
      modalContent.appendChild(modalFooter);
    }

    modal.appendChild(modalContent);
    this.element = modal;

    return modal;
  }

  open() {
    if (this.isOpen) return;

    const modalElement = this.render();
    document.body.appendChild(modalElement);
    document.body.style.overflow = 'hidden';

    // Add open class for animation
    setTimeout(() => {
      modalElement.classList.add('modal-open');
    }, 10);

    this.isOpen = true;

    // Focus first input or button
    const firstInput = modalElement.querySelector('input, textarea, button');
    if (firstInput) {
      firstInput.focus();
    }

    // Handle escape key
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  close() {
    if (!this.isOpen || !this.element) return;

    this.element.classList.remove('modal-open');

    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      document.body.style.overflow = '';
      this.isOpen = false;

      if (this.onClose) {
        this.onClose();
      }
    }, 200);

    document.removeEventListener('keydown', this.escapeHandler);
  }

  updateContent(content) {
    if (!this.element) return;

    const modalBody = this.element.querySelector('.modal-body');
    if (modalBody) {
      if (typeof content === 'string') {
        modalBody.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        modalBody.innerHTML = '';
        modalBody.appendChild(content);
      }
    }
  }

  updateActions(actions) {
    if (!this.element) return;

    const modalFooter = this.element.querySelector('.modal-footer');
    if (modalFooter) {
      modalFooter.innerHTML = '';

      actions.forEach((action, index) => {
        const button = createElement(
          'button',
          `btn ${action.className || 'btn-primary'}`
        );
        button.textContent = action.label;
        button.setAttribute('data-testid', `modal-action-${index}`);

        if (action.onClick) {
          button.addEventListener('click', () => {
            action.onClick(this);
          });
        }

        if (action.disabled) {
          button.disabled = true;
        }

        modalFooter.appendChild(button);
      });
    }
  }
}

/**
 * Show a simple confirmation dialog
 */
export function showConfirmDialog(options = {}) {
  return new Promise((resolve) => {
    const modal = new Modal({
      title: options.title || 'Confirm',
      content: options.message || 'Are you sure?',
      size: 'small',
      actions: [
        {
          label: options.cancelLabel || 'Cancel',
          className: 'btn-outline',
          onClick: (modal) => {
            modal.close();
            resolve(false);
          },
        },
        {
          label: options.confirmLabel || 'Confirm',
          className: options.dangerous ? 'btn-danger' : 'btn-primary',
          onClick: (modal) => {
            modal.close();
            resolve(true);
          },
        },
      ],
      onClose: () => resolve(false),
    });

    modal.open();
  });
}

/**
 * Show a simple alert dialog
 */
export function showAlertDialog(options = {}) {
  return new Promise((resolve) => {
    const modal = new Modal({
      title: options.title || 'Alert',
      content: options.message || '',
      size: 'small',
      actions: [
        {
          label: options.buttonLabel || 'OK',
          className: 'btn-primary',
          onClick: (modal) => {
            modal.close();
            resolve();
          },
        },
      ],
      onClose: () => resolve(),
    });

    modal.open();
  });
}

/**
 * Show a prompt dialog
 */
export function showPromptDialog(options = {}) {
  return new Promise((resolve) => {
    const input = createElement('input', 'form-input');
    input.type = 'text';
    input.value = options.defaultValue || '';
    input.placeholder = options.placeholder || '';
    input.maxLength = options.maxLength || 500;
    input.setAttribute('data-testid', 'prompt-input');

    const content = createElement('div');
    if (options.message) {
      const message = createElement('p', 'mb-md', options.message);
      content.appendChild(message);
    }
    content.appendChild(input);

    const modal = new Modal({
      title: options.title || 'Input',
      content: content,
      size: 'small',
      actions: [
        {
          label: 'Cancel',
          className: 'btn-outline',
          onClick: (modal) => {
            modal.close();
            resolve(null);
          },
        },
        {
          label: options.confirmLabel || 'OK',
          className: 'btn-primary',
          onClick: (modal) => {
            const value = input.value.trim();
            if (options.validate) {
              const validation = options.validate(value);
              if (!validation.valid) {
                alert(validation.message || 'Invalid input');
                return;
              }
            }
            modal.close();
            resolve(value);
          },
        },
      ],
      onClose: () => resolve(null),
    });

    modal.open();

    // Focus input and handle enter key
    input.focus();
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        if (options.validate) {
          const validation = options.validate(value);
          if (!validation.valid) {
            alert(validation.message || 'Invalid input');
            return;
          }
        }
        modal.close();
        resolve(value);
      }
    });
  });
}
