import { IoSettingsSharp } from "react-icons/io5";
import { fieldMap } from "../types/SettingsUpdateField";

import EditableSettingsField from "../components/ui/EditableSettingsField";
import useSettingsLogic from "../utils/customHooks/useSettingsLogic";
import EditSettingsField from "../components/form/EditSettingsField";
import PageSectionTitle from "../components/ui/PageSectionTitle";
import PageTitle from "../components/ui/PageTitle";
import AppLayout from "../layout/AppLayout"

const Settings = () => {  
  const {
    edit,
    data,
    flag,
    error,
    staticDataRef,
    SETTINGS_SECTIONS,
    EditUserData,
    showToast,
    setError,
    setEdit,
    setData,
  } = useSettingsLogic();

  return (
    <AppLayout pageSelected="settings">
      {() => {
        return (
          <>
            <PageTitle
              style="mb-4 mt-4"
              title="Configurações"
              icon={IoSettingsSharp}
            />

            {SETTINGS_SECTIONS.map(section => (
              <div key={section.title}>
                <PageSectionTitle title={section.title} icon={section.icon} />

                <div className="md:hidden block mb-2" />

                <div className="flex flex-col gap-1 ml-1">
                  {section.fields.map(field => (
                    <EditableSettingsField
                      key={field.label}
                      element={{
                        fieldLabel: field.label,
                        fieldType: field.type,
                        fieldIcon: field.icon,
                      }}
                      staticData={staticDataRef.current}
                      action={{ setEdit }}
                    />
                  ))}
                </div>

                <div className="md:hidden block mt-2" />
              </div>
            ))}

            {edit && (
              <EditSettingsField
                element={{
                  field: edit.field,
                  fieldType: edit.fieldType,
                  error,
                  edit,
                  fieldKey: fieldMap[edit.field],
                }}
                action={{
                  showToast,
                  EditUserData,
                  setData,
                  setError,
                  setEdit,
                }}
                flag={{ processingState: flag.processingState }}
                data={data}
                staticDataRef={staticDataRef}
              />
            )}
          </>
        );
      }}
    </AppLayout>
  )
}

export default Settings;