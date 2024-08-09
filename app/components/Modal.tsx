import {Button} from '@/components/button';
import {Link} from '@remix-run/react';
import {useEffect} from 'react';
import {IconClose} from './Icon';

export function Modal({
  children,
  cancelLink,
  onClose,
}: {
  children: React.ReactNode;
  cancelLink?: string;
  onClose?: () => void;
}) {
  useEffect(() => {
    if (!document.body.classList.contains('overflow-hidden')) {
      document.body.classList.add('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="modal-bg"
    >
      <div className="fixed inset-0 bg-primary/40 bg-opacity-75 transition-opacity"></div>
      <div
        className="fixed inset-0 z-50 overflow-y-hidden"
      >
        <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className='absolute inset-0 z-10' onClick={onClose}/>
          <div
            className="relative z-20 flex-1 transform overflow-hidden rounded text-left transition-all sm:flex-none"
            role="dialog"
            onKeyPress={(e) => {
              e.stopPropagation();
            }}
            tabIndex={0}
          >
            <div className="absolute right-0 top-0">
              {cancelLink ? (
                <Link
                  to={cancelLink}
                  className="text-body hover:text-body/50 -m-4 transition"
                >
                  <IconClose aria-label="Close panel" />
                </Link>
              ) : (
                <Button variant="link" onClick={onClose}>
                  <IconClose aria-label="Close panel" />
                </Button>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
