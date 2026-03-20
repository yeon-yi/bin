import type { QRType } from '../../types';

interface Props {
  type: QRType;
  formData: Record<string, string>;
  onChange: (field: string, value: string) => void;
  t: (key: string) => string;
}

export default function GeneratorForm({ type, formData, onChange, t }: Props) {
  switch (type) {
    case 'url':
      return (
        <div className="form-group">
          <input
            className="form-input"
            type="url"
            placeholder={t('generate.placeholder.url')}
            value={formData.url ?? ''}
            onChange={e => onChange('url', e.target.value)}
            autoComplete="url"
          />
        </div>
      );

    case 'text':
      return (
        <div className="form-group">
          <textarea
            className="form-input form-textarea"
            placeholder={t('generate.placeholder.text')}
            value={formData.text ?? ''}
            onChange={e => onChange('text', e.target.value)}
          />
        </div>
      );

    case 'wifi':
      return (
        <>
          <div className="form-group">
            <input
              className="form-input"
              placeholder={t('generate.placeholder.wifi.ssid')}
              value={formData.ssid ?? ''}
              onChange={e => onChange('ssid', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder={t('generate.placeholder.wifi.password')}
              value={formData.wifiPass ?? ''}
              onChange={e => onChange('wifiPass', e.target.value)}
            />
          </div>
          <div className="form-group">
            <select
              className="form-select"
              value={formData.encryption ?? 'WPA'}
              onChange={e => onChange('encryption', e.target.value)}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Open</option>
            </select>
          </div>
        </>
      );

    case 'phone':
      return (
        <div className="form-group">
          <input
            className="form-input"
            type="tel"
            placeholder={t('generate.placeholder.phone')}
            value={formData.phone ?? ''}
            onChange={e => onChange('phone', e.target.value)}
          />
        </div>
      );

    case 'email':
      return (
        <>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder={t('generate.placeholder.email.to')}
              value={formData.emailTo ?? ''}
              onChange={e => onChange('emailTo', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder={t('generate.placeholder.email.subject')}
              value={formData.emailSubject ?? ''}
              onChange={e => onChange('emailSubject', e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              placeholder={t('generate.placeholder.email.body')}
              value={formData.emailBody ?? ''}
              onChange={e => onChange('emailBody', e.target.value)}
            />
          </div>
        </>
      );

    case 'sms':
      return (
        <>
          <div className="form-group">
            <input
              className="form-input"
              type="tel"
              placeholder={t('generate.placeholder.sms.to')}
              value={formData.smsTo ?? ''}
              onChange={e => onChange('smsTo', e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              placeholder={t('generate.placeholder.sms.body')}
              value={formData.smsBody ?? ''}
              onChange={e => onChange('smsBody', e.target.value)}
            />
          </div>
        </>
      );

    case 'vcard':
      return (
        <>
          <div className="form-group">
            <input
              className="form-input"
              placeholder={t('generate.placeholder.vcard.name')}
              value={formData.vcardName ?? ''}
              onChange={e => onChange('vcardName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="tel"
              placeholder={t('generate.placeholder.vcard.phone')}
              value={formData.vcardPhone ?? ''}
              onChange={e => onChange('vcardPhone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder={t('generate.placeholder.vcard.email')}
              value={formData.vcardEmail ?? ''}
              onChange={e => onChange('vcardEmail', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder={t('generate.placeholder.vcard.org')}
              value={formData.vcardOrg ?? ''}
              onChange={e => onChange('vcardOrg', e.target.value)}
            />
          </div>
        </>
      );

    default:
      return null;
  }
}
