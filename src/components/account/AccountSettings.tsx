import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const AccountSettings: React.FC = () => {
  // Dados Cadastrais
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Privacy / access
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowMarketing, setAllowMarketing] = useState(true);

  // Mock addresses and cards
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Casa", value: "Rua A, 123" },
  ]);
  const [cards, setCards] = useState([{ id: 1, label: "Visa **** 4242" }]);

  const handleSaveDados = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvar Dados Cadastrais", { name, cpf, email, phone });
    alert("Dados salvos (mock)");
  };

  const handleAddAddress = () => {
    const next = { id: Date.now(), label: "Novo", value: "" };
    setAddresses((s) => [...s, next]);
  };

  const handleAddCard = () => {
    const next = { id: Date.now(), label: "Cartão novo" };
    setCards((s) => [...s, next]);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Senha alterada (mock)");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Dados e Segurança</h2>

      <Tabs defaultValue="dados">
        <TabsList>
          <TabsTrigger value="dados">Dados Cadastrais</TabsTrigger>
          <TabsTrigger value="enderecos">Endereços</TabsTrigger>
          <TabsTrigger value="pagamentos">Meios de Pagamento</TabsTrigger>
          <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
          <TabsTrigger value="privacidade">Privacidade</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card className="p-4 mt-2">
            <form onSubmit={handleSaveDados} className="space-y-4">
              <div>
                <label className="text-sm block mb-1 text-muted-foreground">Nome</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
              </div>
              <div>
                <label className="text-sm block mb-1 text-muted-foreground">CPF</label>
                <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="text-sm block mb-1 text-muted-foreground">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="text-sm block mb-1 text-muted-foreground">Telefone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 90000-0000" />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="enderecos">
          <Card className="p-4 mt-2 space-y-3">
            <div className="flex justify-between items-center">
              <div className="font-medium">Endereços</div>
              <Button variant="ghost" onClick={handleAddAddress}>Adicionar</Button>
            </div>
            <div className="space-y-2">
              {addresses.map((a) => (
                <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{a.label}</div>
                    <div className="text-sm text-muted-foreground">{a.value || 'Sem endereço'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Editar</Button>
                    <Button variant="ghost" size="sm">Remover</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos">
          <Card className="p-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">Meios de Pagamento</div>
              <Button variant="ghost" onClick={handleAddCard}>Adicionar Cartão</Button>
            </div>
            <div className="space-y-2">
              {cards.map((c) => (
                <div key={c.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="text-sm">{c.label}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Remover</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="senha">
          <Card className="p-4 mt-2">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm block mb-1 text-muted-foreground">Senha atual</label>
                <PasswordInput placeholder="Senha atual" />
              </div>
              <div>
                <label className="text-sm block mb-1 text-muted-foreground">Nova senha</label>
                <PasswordInput placeholder="Nova senha" />
              </div>
              <div>
                <label className="text-sm block mb-1 text-muted-foreground">Confirmar senha</label>
                <PasswordInput placeholder="Confirmar senha" />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Alterar Senha</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="privacidade">
          <Card className="p-4 mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Conta privada</div>
                <div className="text-sm text-muted-foreground">Impede que informações públicas sejam exibidas.</div>
              </div>
              <Switch checked={isPrivate} onCheckedChange={(v) => setIsPrivate(Boolean(v))} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Permitir marketing</div>
                <div className="text-sm text-muted-foreground">Receber promoções por e-mail/SMS.</div>
              </div>
              <Switch checked={allowMarketing} onCheckedChange={(v) => setAllowMarketing(Boolean(v))} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
