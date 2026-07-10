import { useCallback, useEffect, useState } from 'react';
import CustomerForm from '../components/CustomerForm.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useI18n } from '../i18n.jsx';
import { api } from '../services/api.js';

const copy = {
  tr: {
    description: 'Müşteri kartlarını ekleyin, düzenleyin ve yönetin.',
    added: 'Müşteri başarıyla eklendi.', updated: 'Müşteri bilgileri güncellendi.', deleted: 'Müşteri silindi.',
    loadFailed: 'Müşteriler yüklenemedi.', createFailed: 'Müşteri eklenemedi.', updateFailed: 'Müşteri güncellenemedi.',
    deleteFailed: 'Müşteri silinemedi. Bu müşteriye bağlı teklifler bulunuyor olabilir.', closeNotice: 'Bildirimi kapat',
    customerCompany: 'Müşteri / Firma', contact: 'İletişim', taxNo: 'Vergi No', address: 'Adres', loading: 'Yükleniyor…',
    empty: 'Henüz müşteri yok. “Yeni Müşteri” ile ilk kaydı oluşturun.', individual: 'Bireysel müşteri', edit: 'Düzenle', delete: 'Sil',
    createTitle: 'Yeni Müşteri', addCustomer: 'Müşteri Ekle', editTitle: 'Müşteriyi Düzenle', saveChanges: 'Değişiklikleri Kaydet',
    deleteTitle: 'Müşteriyi Sil', deleteQuestion: '“{name}” adlı müşteriyi silmek istediğinizden emin misiniz?',
    deleteWarning: 'Bu işlem geri alınamaz. Müşteriye bağlı teklifler varsa kayıt korunur ve silme işlemi yapılmaz.',
    cancel: 'Vazgeç', confirmDelete: 'Evet, Sil'
  },
  en: {
    description: 'Add, edit, and manage your customer records.',
    added: 'Customer added successfully.', updated: 'Customer information updated.', deleted: 'Customer deleted.',
    loadFailed: 'Customers could not be loaded.', createFailed: 'Customer could not be added.', updateFailed: 'Customer could not be updated.',
    deleteFailed: 'Customer could not be deleted. This customer may have linked quotes.', closeNotice: 'Dismiss notification',
    customerCompany: 'Customer / Company', contact: 'Contact', taxNo: 'Tax ID', address: 'Address', loading: 'Loading…',
    empty: 'No customers yet. Select “New Customer” to create your first record.', individual: 'Individual customer', edit: 'Edit', delete: 'Delete',
    createTitle: 'New Customer', addCustomer: 'Add Customer', editTitle: 'Edit Customer', saveChanges: 'Save Changes',
    deleteTitle: 'Delete Customer', deleteQuestion: 'Are you sure you want to delete “{name}”?',
    deleteWarning: 'This action cannot be undone. If the customer has linked quotes, the record will be kept and will not be deleted.',
    cancel: 'Cancel', confirmDelete: 'Yes, Delete'
  },
  zh: {
    description: '添加、编辑和管理客户资料。',
    added: '客户添加成功。', updated: '客户信息已更新。', deleted: '客户已删除。',
    loadFailed: '无法加载客户。', createFailed: '无法添加客户。', updateFailed: '无法更新客户。',
    deleteFailed: '无法删除客户。该客户可能关联了报价。', closeNotice: '关闭通知',
    customerCompany: '客户 / 公司', contact: '联系方式', taxNo: '税号', address: '地址', loading: '正在加载…',
    empty: '暂无客户。请选择“新客户”创建第一条记录。', individual: '个人客户', edit: '编辑', delete: '删除',
    createTitle: '新客户', addCustomer: '添加客户', editTitle: '编辑客户', saveChanges: '保存更改',
    deleteTitle: '删除客户', deleteQuestion: '确定要删除“{name}”吗？',
    deleteWarning: '此操作无法撤销。如果该客户关联了报价，记录将被保留且不会删除。',
    cancel: '取消', confirmDelete: '确认删除'
  },
  hi: {
    description: 'ग्राहक रिकॉर्ड जोड़ें, संपादित करें और प्रबंधित करें।',
    added: 'ग्राहक सफलतापूर्वक जोड़ा गया।', updated: 'ग्राहक की जानकारी अपडेट की गई।', deleted: 'ग्राहक हटा दिया गया।',
    loadFailed: 'ग्राहक लोड नहीं किए जा सके।', createFailed: 'ग्राहक जोड़ा नहीं जा सका।', updateFailed: 'ग्राहक अपडेट नहीं किया जा सका।',
    deleteFailed: 'ग्राहक हटाया नहीं जा सका। इस ग्राहक से जुड़े कोटेशन हो सकते हैं।', closeNotice: 'सूचना बंद करें',
    customerCompany: 'ग्राहक / कंपनी', contact: 'संपर्क', taxNo: 'कर संख्या', address: 'पता', loading: 'लोड हो रहा है…',
    empty: 'अभी कोई ग्राहक नहीं है। पहला रिकॉर्ड बनाने के लिए “नया ग्राहक” चुनें।', individual: 'व्यक्तिगत ग्राहक', edit: 'संपादित करें', delete: 'हटाएँ',
    createTitle: 'नया ग्राहक', addCustomer: 'ग्राहक जोड़ें', editTitle: 'ग्राहक संपादित करें', saveChanges: 'बदलाव सहेजें',
    deleteTitle: 'ग्राहक हटाएँ', deleteQuestion: 'क्या आप वाकई “{name}” को हटाना चाहते हैं?',
    deleteWarning: 'इस क्रिया को वापस नहीं लिया जा सकता। यदि ग्राहक से कोटेशन जुड़े हैं, तो रिकॉर्ड सुरक्षित रहेगा और हटाया नहीं जाएगा।',
    cancel: 'रद्द करें', confirmDelete: 'हाँ, हटाएँ'
  },
  es: {
    description: 'Añade, edita y administra tus registros de clientes.',
    added: 'Cliente añadido correctamente.', updated: 'Información del cliente actualizada.', deleted: 'Cliente eliminado.',
    loadFailed: 'No se pudieron cargar los clientes.', createFailed: 'No se pudo añadir el cliente.', updateFailed: 'No se pudo actualizar el cliente.',
    deleteFailed: 'No se pudo eliminar el cliente. Puede tener presupuestos vinculados.', closeNotice: 'Cerrar notificación',
    customerCompany: 'Cliente / Empresa', contact: 'Contacto', taxNo: 'N.º fiscal', address: 'Dirección', loading: 'Cargando…',
    empty: 'Aún no hay clientes. Selecciona “Nuevo cliente” para crear el primer registro.', individual: 'Cliente particular', edit: 'Editar', delete: 'Eliminar',
    createTitle: 'Nuevo cliente', addCustomer: 'Añadir cliente', editTitle: 'Editar cliente', saveChanges: 'Guardar cambios',
    deleteTitle: 'Eliminar cliente', deleteQuestion: '¿Seguro que deseas eliminar a “{name}”?',
    deleteWarning: 'Esta acción no se puede deshacer. Si el cliente tiene presupuestos vinculados, el registro se conservará y no se eliminará.',
    cancel: 'Cancelar', confirmDelete: 'Sí, eliminar'
  },
  ar: {
    description: 'أضف سجلات العملاء وعدّلها وأدرها.',
    added: 'تمت إضافة العميل بنجاح.', updated: 'تم تحديث معلومات العميل.', deleted: 'تم حذف العميل.',
    loadFailed: 'تعذّر تحميل العملاء.', createFailed: 'تعذّرت إضافة العميل.', updateFailed: 'تعذّر تحديث العميل.',
    deleteFailed: 'تعذّر حذف العميل. قد توجد عروض أسعار مرتبطة به.', closeNotice: 'إغلاق الإشعار',
    customerCompany: 'العميل / الشركة', contact: 'التواصل', taxNo: 'الرقم الضريبي', address: 'العنوان', loading: 'جارٍ التحميل…',
    empty: 'لا يوجد عملاء بعد. اختر «عميل جديد» لإنشاء أول سجل.', individual: 'عميل فردي', edit: 'تعديل', delete: 'حذف',
    createTitle: 'عميل جديد', addCustomer: 'إضافة العميل', editTitle: 'تعديل العميل', saveChanges: 'حفظ التغييرات',
    deleteTitle: 'حذف العميل', deleteQuestion: 'هل أنت متأكد من حذف «{name}»؟',
    deleteWarning: 'لا يمكن التراجع عن هذا الإجراء. إذا كانت هناك عروض مرتبطة بالعميل فسيُحتفظ بالسجل ولن يُحذف.',
    cancel: 'إلغاء', confirmDelete: 'نعم، احذف'
  },
  pt: {
    description: 'Adicione, edite e gerencie os registros de clientes.',
    added: 'Cliente adicionado com sucesso.', updated: 'Informações do cliente atualizadas.', deleted: 'Cliente excluído.',
    loadFailed: 'Não foi possível carregar os clientes.', createFailed: 'Não foi possível adicionar o cliente.', updateFailed: 'Não foi possível atualizar o cliente.',
    deleteFailed: 'Não foi possível excluir o cliente. Pode haver propostas vinculadas a ele.', closeNotice: 'Fechar notificação',
    customerCompany: 'Cliente / Empresa', contact: 'Contato', taxNo: 'N.º fiscal', address: 'Endereço', loading: 'Carregando…',
    empty: 'Ainda não há clientes. Selecione “Novo cliente” para criar o primeiro registro.', individual: 'Cliente pessoa física', edit: 'Editar', delete: 'Excluir',
    createTitle: 'Novo cliente', addCustomer: 'Adicionar cliente', editTitle: 'Editar cliente', saveChanges: 'Salvar alterações',
    deleteTitle: 'Excluir cliente', deleteQuestion: 'Tem certeza de que deseja excluir “{name}”?',
    deleteWarning: 'Esta ação não pode ser desfeita. Se o cliente tiver propostas vinculadas, o registro será mantido e não será excluído.',
    cancel: 'Cancelar', confirmDelete: 'Sim, excluir'
  },
  fr: {
    description: 'Ajoutez, modifiez et gérez vos fiches clients.',
    added: 'Client ajouté avec succès.', updated: 'Informations du client mises à jour.', deleted: 'Client supprimé.',
    loadFailed: 'Impossible de charger les clients.', createFailed: 'Impossible d’ajouter le client.', updateFailed: 'Impossible de mettre à jour le client.',
    deleteFailed: 'Impossible de supprimer le client. Des devis peuvent lui être associés.', closeNotice: 'Fermer la notification',
    customerCompany: 'Client / Entreprise', contact: 'Coordonnées', taxNo: 'N° fiscal', address: 'Adresse', loading: 'Chargement…',
    empty: 'Aucun client pour le moment. Sélectionnez « Nouveau client » pour créer la première fiche.', individual: 'Client particulier', edit: 'Modifier', delete: 'Supprimer',
    createTitle: 'Nouveau client', addCustomer: 'Ajouter le client', editTitle: 'Modifier le client', saveChanges: 'Enregistrer les modifications',
    deleteTitle: 'Supprimer le client', deleteQuestion: 'Voulez-vous vraiment supprimer « {name} » ?',
    deleteWarning: 'Cette action est irréversible. Si des devis sont associés au client, la fiche sera conservée et ne sera pas supprimée.',
    cancel: 'Annuler', confirmDelete: 'Oui, supprimer'
  },
  de: {
    description: 'Kundendatensätze hinzufügen, bearbeiten und verwalten.',
    added: 'Kunde erfolgreich hinzugefügt.', updated: 'Kundendaten aktualisiert.', deleted: 'Kunde gelöscht.',
    loadFailed: 'Kunden konnten nicht geladen werden.', createFailed: 'Kunde konnte nicht hinzugefügt werden.', updateFailed: 'Kunde konnte nicht aktualisiert werden.',
    deleteFailed: 'Kunde konnte nicht gelöscht werden. Möglicherweise sind Angebote mit ihm verknüpft.', closeNotice: 'Benachrichtigung schließen',
    customerCompany: 'Kunde / Firma', contact: 'Kontakt', taxNo: 'Steuernummer', address: 'Adresse', loading: 'Wird geladen…',
    empty: 'Noch keine Kunden vorhanden. Wählen Sie „Neuer Kunde“, um den ersten Datensatz anzulegen.', individual: 'Privatkunde', edit: 'Bearbeiten', delete: 'Löschen',
    createTitle: 'Neuer Kunde', addCustomer: 'Kunde hinzufügen', editTitle: 'Kunde bearbeiten', saveChanges: 'Änderungen speichern',
    deleteTitle: 'Kunde löschen', deleteQuestion: 'Möchten Sie „{name}“ wirklich löschen?',
    deleteWarning: 'Diese Aktion kann nicht rückgängig gemacht werden. Sind Angebote mit dem Kunden verknüpft, bleibt der Datensatz erhalten und wird nicht gelöscht.',
    cancel: 'Abbrechen', confirmDelete: 'Ja, löschen'
  },
  ru: {
    description: 'Добавляйте, редактируйте и управляйте данными клиентов.',
    added: 'Клиент успешно добавлен.', updated: 'Данные клиента обновлены.', deleted: 'Клиент удалён.',
    loadFailed: 'Не удалось загрузить клиентов.', createFailed: 'Не удалось добавить клиента.', updateFailed: 'Не удалось обновить клиента.',
    deleteFailed: 'Не удалось удалить клиента. Возможно, с ним связаны предложения.', closeNotice: 'Закрыть уведомление',
    customerCompany: 'Клиент / Компания', contact: 'Контакты', taxNo: 'ИНН', address: 'Адрес', loading: 'Загрузка…',
    empty: 'Клиентов пока нет. Нажмите «Новый клиент», чтобы создать первую запись.', individual: 'Частный клиент', edit: 'Изменить', delete: 'Удалить',
    createTitle: 'Новый клиент', addCustomer: 'Добавить клиента', editTitle: 'Изменить клиента', saveChanges: 'Сохранить изменения',
    deleteTitle: 'Удалить клиента', deleteQuestion: 'Вы уверены, что хотите удалить «{name}»?',
    deleteWarning: 'Это действие нельзя отменить. Если с клиентом связаны предложения, запись будет сохранена и не удалится.',
    cancel: 'Отмена', confirmDelete: 'Да, удалить'
  },
  ja: {
    description: '顧客情報を追加、編集、管理します。',
    added: '顧客を追加しました。', updated: '顧客情報を更新しました。', deleted: '顧客を削除しました。',
    loadFailed: '顧客を読み込めませんでした。', createFailed: '顧客を追加できませんでした。', updateFailed: '顧客を更新できませんでした。',
    deleteFailed: '顧客を削除できませんでした。この顧客に見積が関連付けられている可能性があります。', closeNotice: '通知を閉じる',
    customerCompany: '顧客 / 会社', contact: '連絡先', taxNo: '税番号', address: '住所', loading: '読み込み中…',
    empty: '顧客はまだありません。「新規顧客」から最初の顧客を登録してください。', individual: '個人顧客', edit: '編集', delete: '削除',
    createTitle: '新規顧客', addCustomer: '顧客を追加', editTitle: '顧客を編集', saveChanges: '変更を保存',
    deleteTitle: '顧客を削除', deleteQuestion: '「{name}」を削除してもよろしいですか？',
    deleteWarning: 'この操作は元に戻せません。顧客に見積が関連付けられている場合、記録は保持され削除されません。',
    cancel: 'キャンセル', confirmDelete: '削除する'
  }
};

export default function Customers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState(null);
  const [page, setPage] = useState(1);
  const { language, t } = useI18n();
  const text = copy[language] || copy.en;
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.customers.list());
    } catch {
      setNotice({ type: 'error', text: text.loadFailed });
    } finally {
      setLoading(false);
    }
  }, [text.loadFailed]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage((current) => Math.min(current, pageCount)); }, [pageCount]);

  const saveNew = async (data) => {
    try {
      await api.customers.create(data);
      setDialog(null);
      setNotice({ type: 'success', text: text.added });
      await load();
    } catch {
      setNotice({ type: 'error', text: text.createFailed });
    }
  };

  const saveEdit = async (data) => {
    try {
      await api.customers.update(dialog.customer.id, data);
      setDialog(null);
      setNotice({ type: 'success', text: text.updated });
      await load();
    } catch {
      setNotice({ type: 'error', text: text.updateFailed });
    }
  };

  const remove = async () => {
    try {
      await api.customers.remove(dialog.customer.id);
      setDialog(null);
      setNotice({ type: 'success', text: text.deleted });
      await load();
    } catch {
      setDialog(null);
      setNotice({ type: 'error', text: text.deleteFailed });
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-5">
        <PageHeader title={t('customers')} description={text.description} />
        <button
          type="button"
          onClick={() => setDialog({ type: 'create' })}
          className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          + {t('newCustomer')}
        </button>
      </div>

      {notice && (
        <div className={`mb-5 flex justify-between gap-4 rounded-lg px-4 py-3 text-sm ${notice.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label={text.closeNotice}>×</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-start text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">{text.customerCompany}</th>
                <th className="px-5 py-4">{text.contact}</th>
                <th className="px-5 py-4">{text.taxNo}</th>
                <th className="px-5 py-4">{text.address}</th>
                <th className="px-5 py-4 text-end">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">{text.loading}</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-500">{text.empty}</td></tr>
              ) : visibleItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <strong className="block text-slate-900">{item.name}</strong>
                    <span className="text-slate-500">{item.company || text.individual}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="block">{item.phone || '—'}</span>
                    <span className="text-slate-500">{item.email || '—'}</span>
                  </td>
                  <td className="px-5 py-4">{item.tax_number || '—'}</td>
                  <td className="max-w-xs truncate px-5 py-4" title={item.address || ''}>{item.address || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-end">
                    <button
                      type="button"
                      onClick={() => setDialog({ type: 'edit', customer: item })}
                      className="me-2 rounded-md px-3 py-2 font-medium text-blue-700 hover:bg-blue-50"
                    >
                      {text.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDialog({ type: 'delete', customer: item })}
                      className="rounded-md px-3 py-2 font-medium text-red-700 hover:bg-red-50"
                    >
                      {text.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && items.length > 0 && (
          <footer className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm">
            <span className="text-slate-500">{items.length} {t('rows')}</span>
            <div className="flex items-center gap-3">
              <button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40">{t('previous')}</button>
              <strong>{t('page')} {page} {t('of')} {pageCount}</strong>
              <button type="button" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40">{t('next')}</button>
            </div>
          </footer>
        )}
      </div>

      {dialog?.type === 'create' && (
        <Modal title={text.createTitle} onClose={() => setDialog(null)}>
          <CustomerForm submitLabel={text.addCustomer} onSubmit={saveNew} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.type === 'edit' && (
        <Modal title={text.editTitle} onClose={() => setDialog(null)}>
          <CustomerForm initialValue={dialog.customer} submitLabel={text.saveChanges} onSubmit={saveEdit} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.type === 'delete' && (
        <Modal title={text.deleteTitle} onClose={() => setDialog(null)}>
          <div className="p-6">
            <p>{text.deleteQuestion.replace('{name}', dialog.customer.name)}</p>
            <p className="mt-2 text-sm text-slate-500">{text.deleteWarning}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDialog(null)} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold">{text.cancel}</button>
              <button type="button" onClick={remove} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white">{text.confirmDelete}</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
